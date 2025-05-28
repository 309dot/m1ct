import fs from 'fs';
import path from 'path';

// 구글 시트 CSV URL (공개 시트의 CSV 내보내기 URL)
// 예시: https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
const GOOGLE_SHEET_CSV_URL = process.env.GOOGLE_SHEET_CSV_URL || '';

// 슬러그 생성 함수
function generateSlug(name, origin) {
  const base = `${name}-${origin}`
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // 간단한 해시 생성 (고유성을 위해)
  const hash = Math.abs(hashCode(base)).toString(36).substring(0, 6);
  return `${base}-${hash}`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer로 변환
  }
  return hash;
}

// CSV 파싱 함수
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // 활성화된 원두만 포함
    if (row.active === 'TRUE' || row.active === 'true') {
      data.push(row);
    }
  }

  return data;
}

// 데이터 변환 함수
function transformData(rawData) {
  return rawData.map(row => {
    // 슬러그가 없으면 자동 생성
    const slug = row.slug || generateSlug(row.name, row.origin);
    
    return {
      id: row.id,
      name: row.name,
      origin: row.origin,
      slug: slug,
      description: row.description,
      farmer: row.farmer,
      altitude: row.altitude,
      processingMethod: row.process || row.processing_method,
      roastLevel: row.roast_level,
      harvestDate: row.harvest_date,
      price: parseInt(row.price) || 0,
      badges: row.badges ? row.badges.split(',').map(b => b.trim()) : [],
      tastingNotes: row.tasting_notes ? row.tasting_notes.split(',').map(n => n.trim()) : [],
      active: row.active === 'TRUE' || row.active === 'true',
      createdAt: row.created_at || new Date().toISOString().split('T')[0]
    };
  });
}

// 메인 함수
async function syncGoogleSheets() {
  try {
    console.log('🔄 구글 시트에서 데이터를 가져오는 중...');

    if (!GOOGLE_SHEET_CSV_URL) {
      console.log('⚠️  GOOGLE_SHEET_CSV_URL 환경변수가 설정되지 않았습니다.');
      console.log('📝 임시 데이터를 사용합니다.');
      
      // 임시 데이터 생성
      const tempData = [
        {
          id: 'eth-001',
          name: 'Addisu Hulichaye',
          origin: 'Sidamo, Ethiopia',
          slug: 'addisu-hulichaye-ethiopia',
          description: 'A bright and floral coffee with citrus notes and a clean finish. This natural process coffee showcases the unique terroir of the Sidamo region.',
          farmer: 'Addisu Hulichaye',
          altitude: '1,800-2,000m',
          processingMethod: 'Natural',
          roastLevel: 'Light',
          harvestDate: '2023년 11월',
          price: 28000,
          badges: ['lemon peel', 'peach', 'orange'],
          tastingNotes: ['citrus', 'floral', 'bright', 'clean'],
          active: true,
          createdAt: '2024-01-15'
        },
        {
          id: 'col-001',
          name: 'Colombian Supremo',
          origin: 'Huila, Colombia',
          slug: 'colombian-supremo-huila',
          description: 'A well-balanced coffee with chocolate and caramel notes. This washed process coffee offers a smooth and rich flavor profile.',
          farmer: 'Various Cooperatives',
          altitude: '1,500-1,800m',
          processingMethod: 'Washed',
          roastLevel: 'Medium',
          harvestDate: '2023년 12월',
          price: 25000,
          badges: ['chocolate', 'caramel', 'smooth'],
          tastingNotes: ['chocolate', 'caramel', 'balanced', 'rich'],
          active: true,
          createdAt: '2024-01-20'
        }
      ];

      // JSON 파일로 저장
      const outputPath = path.join(process.cwd(), 'public', 'data', 'coffees.json');
      fs.writeFileSync(outputPath, JSON.stringify(tempData, null, 2));
      
      console.log(`✅ 임시 데이터가 ${outputPath}에 저장되었습니다.`);
      console.log(`📊 총 ${tempData.length}개의 커피 데이터`);
      return;
    }

    // 구글 시트에서 데이터 가져오기
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const rawData = parseCSV(csvText);
    const transformedData = transformData(rawData);

    // JSON 파일로 저장
    const outputPath = path.join(process.cwd(), 'public', 'data', 'coffees.json');
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

    console.log(`✅ 데이터가 ${outputPath}에 저장되었습니다.`);
    console.log(`📊 총 ${transformedData.length}개의 활성 커피 데이터`);

    // 슬러그 목록 생성 (라우팅용)
    const slugs = transformedData.map(coffee => ({
      slug: coffee.slug,
      name: coffee.name,
      origin: coffee.origin
    }));

    const slugsPath = path.join(process.cwd(), 'public', 'data', 'slugs.json');
    fs.writeFileSync(slugsPath, JSON.stringify(slugs, null, 2));

    console.log(`📝 슬러그 목록이 ${slugsPath}에 저장되었습니다.`);

  } catch (error) {
    console.error('❌ 데이터 동기화 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
syncGoogleSheets(); 