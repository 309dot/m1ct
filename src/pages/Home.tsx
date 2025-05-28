import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CoffeeSlug {
  slug: string;
  name: string;
  origin: string;
}

export function Home() {
  const [coffees, setCoffees] = useState<CoffeeSlug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoffees = async () => {
      try {
        const response = await fetch('/data/coffees.json');
        if (!response.ok) {
          throw new Error('데이터를 불러올 수 없습니다.');
        }
        
        const coffeeData = await response.json();
        const slugs = coffeeData.map((coffee: any) => ({
          slug: coffee.slug,
          name: coffee.name,
          origin: coffee.origin
        }));
        
        setCoffees(slugs);
      } catch (error) {
        console.error('Error loading coffee data:', error);
        // 에러 시 기본 데이터 사용
        setCoffees([
          { slug: 'addisu-hulichaye-ethiopia', name: 'Addisu Hulichaye', origin: 'Sidamo, Ethiopia' },
          { slug: 'colombian-supremo-huila', name: 'Colombian Supremo', origin: 'Huila, Colombia' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCoffees();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ☕ M1CT Coffee
        </h1>
        <p className="text-gray-600 mb-8">
          NFC 기반 커피 정보 플랫폼
        </p>
        
        <div className="space-y-3">
          {coffees.map((coffee) => (
            <Link
              key={coffee.slug}
              to={`/bean/${coffee.slug}`}
              className="block w-full py-3 px-6 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors"
            >
              {coffee.name}, {coffee.origin}
            </Link>
          ))}
        </div>
        
        {coffees.length === 0 && (
          <p className="text-gray-500 mt-4">
            등록된 커피가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
} 