import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { ArrowRightIcon } from '../components/icons';

interface CoffeeData {
  id: string;
  name: string;
  origin: string;
  slug: string;
  description: string;
  farmer: string;
  altitude: string;
  processingMethod: string;
  roastLevel: string;
  harvestDate: string;
  price: number;
  badges: string[];
  tastingNotes: string[];
  active: boolean;
  createdAt: string;
}

export function Details() {
  const { slug } = useParams<{ slug: string }>();
  const [coffee, setCoffee] = useState<CoffeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoffeeData = async () => {
      setLoading(true);
      try {
        // JSON 파일에서 데이터 로드
        const response = await fetch('/data/coffees.json');
        if (!response.ok) {
          throw new Error('데이터를 불러올 수 없습니다.');
        }
        
        const coffeeData: CoffeeData[] = await response.json();
        const foundCoffee = coffeeData.find(c => c.slug === slug);
        setCoffee(foundCoffee || null);
      } catch (error) {
        console.error('Error loading coffee data:', error);
        setCoffee(null);
      } finally {
        setLoading(false);
      }
    };

    loadCoffeeData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600 mb-4">커피 정보를 찾을 수 없습니다.</p>
          <Link
            to="/"
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        {/* Header */}
        <section className="px-6 pt-8 pb-4">
          <Link
            to="/"
            className="inline-block mb-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 홈으로
          </Link>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {coffee.name}
            </h1>
            <p className="text-base font-light text-gray-700 mt-1">
              {coffee.origin}
            </p>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {coffee.badges.map((badge, index) => (
              <Badge key={index}>
                {badge}
              </Badge>
            ))}
          </div>
        </section>

        {/* Coffee Details */}
        <section className="px-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Description */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">설명</h3>
              <p className="text-gray-800 text-sm">
                {coffee.description}
              </p>
            </div>

            {/* Coffee Info */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-3">커피 정보</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">농부</p>
                  <p className="font-medium text-gray-900">{coffee.farmer}</p>
                </div>
                <div>
                  <p className="text-gray-600">고도</p>
                  <p className="font-medium text-gray-900">{coffee.altitude}</p>
                </div>
                <div>
                  <p className="text-gray-600">가공 방식</p>
                  <p className="font-medium text-gray-900">{coffee.processingMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">로스팅</p>
                  <p className="font-medium text-gray-900">{coffee.roastLevel}</p>
                </div>
                <div>
                  <p className="text-gray-600">수확 시기</p>
                  <p className="font-medium text-gray-900">{coffee.harvestDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">가격</p>
                  <p className="font-bold text-gray-900">₩{coffee.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Tasting Notes */}
            <div className="bg-yellow-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-3">테이스팅 노트</h3>
              <div className="flex flex-wrap gap-2">
                {coffee.tastingNotes.map((note, index) => (
                  <span
                    key={index}
                    className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="px-6 py-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              즐겨찾기 추가
            </button>
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              장바구니 담기
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
} 