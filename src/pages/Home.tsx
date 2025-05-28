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
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          <div className="bg-white rounded-b-2xl flex-1 flex flex-col items-center justify-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
          {/* Header */}
          <section className="px-6 pt-6 pb-4">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                ☕ M1CT Coffee
              </h1>
              <p className="text-text-muted">
                NFC 기반 커피 정보 플랫폼
              </p>
            </div>
          </section>

          {/* Coffee List */}
          <section className="px-6 flex-1 overflow-y-auto">
            <div className="space-y-3">
              {coffees.map((coffee) => (
                <Link
                  key={coffee.slug}
                  to={`/bean/${coffee.slug}`}
                  className="block w-full p-4 bg-badge-bg rounded-2xl hover:bg-badge-bg/80 transition-colors"
                >
                  <h3 className="font-bold text-text-primary mb-1">
                    {coffee.name}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {coffee.origin}
                  </p>
                </Link>
              ))}
            </div>
            
            {coffees.length === 0 && (
              <div className="text-center py-8">
                <p className="text-text-muted">
                  등록된 커피가 없습니다.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
} 