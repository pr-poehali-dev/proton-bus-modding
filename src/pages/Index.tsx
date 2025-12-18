import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Mod {
  id: number;
  title: string;
  author: string;
  category: string;
  downloads: number;
  likes: number;
  date: string;
  image: string;
}

const mockMods: Mod[] = [
  {
    id: 1,
    title: 'Mercedes-Benz O500 RS',
    author: 'BusModder2024',
    category: 'Автобусы',
    downloads: 15420,
    likes: 342,
    date: '2024-12-15',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'Scania Touring HD',
    author: 'ProtonFan',
    category: 'Автобусы',
    downloads: 12890,
    likes: 287,
    date: '2024-12-10',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Volvo 9800 DD',
    author: 'BusModder2024',
    category: 'Автобусы',
    downloads: 9234,
    likes: 198,
    date: '2024-12-05',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'Карта: Бразилия Экстрим',
    author: 'MapMaster',
    category: 'Карты',
    downloads: 18900,
    likes: 456,
    date: '2024-12-12',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: 'Пак скинов Россия',
    author: 'SkinCreator',
    category: 'Скины',
    downloads: 7654,
    likes: 134,
    date: '2024-12-08',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: 'МАЗ 251 Классический',
    author: 'RusBusMods',
    category: 'Автобусы',
    downloads: 11234,
    likes: 245,
    date: '2024-12-14',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRegistered, setIsRegistered] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [likedMods, setLikedMods] = useState<number[]>([]);

  const categories = ['all', 'Автобусы', 'Карты', 'Скины'];

  const filteredMods = mockMods.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         mod.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (modId: number) => {
    if (likedMods.includes(modId)) {
      setLikedMods(likedMods.filter(id => id !== modId));
      toast.success('Лайк убран');
    } else {
      setLikedMods([...likedMods, modId]);
      toast.success('Лайк поставлен!');
    }
  };

  const handleDownload = (modTitle: string) => {
    toast.success(`Скачивание "${modTitle}" началось!`);
  };

  const handleUpload = () => {
    if (!isRegistered) {
      toast.error('Необходима регистрация для загрузки модов');
      return;
    }
    if (!uploadFile) {
      toast.error('Выберите файл для загрузки');
      return;
    }
    toast.success('Мод успешно загружен!');
    setUploadFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Bus" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Proton Bus Mods
              </h1>
            </div>
            
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить мод
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Загрузить мод</DialogTitle>
                  </DialogHeader>
                  {!isRegistered ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Для загрузки модов необходима регистрация</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">Зарегистрироваться</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Регистрация</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="username">Имя пользователя</Label>
                              <Input id="username" placeholder="Введите имя" />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" placeholder="email@example.com" />
                            </div>
                            <div>
                              <Label htmlFor="password">Пароль</Label>
                              <Input id="password" type="password" placeholder="••••••••" />
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                setIsRegistered(true);
                                toast.success('Регистрация успешна!');
                              }}
                            >
                              Зарегистрироваться
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="modTitle">Название мода</Label>
                        <Input id="modTitle" placeholder="Название" />
                      </div>
                      <div>
                        <Label htmlFor="category">Категория</Label>
                        <Input id="category" placeholder="Автобусы, Карты, Скины..." />
                      </div>
                      <div>
                        <Label htmlFor="file">Файл мода</Label>
                        <Input 
                          id="file" 
                          type="file" 
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <Button className="w-full" onClick={handleUpload}>
                        <Icon name="Send" size={16} className="mr-2" />
                        Отправить мод
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="sm">
                <Icon name="User" size={16} className="mr-2" />
                {isRegistered ? 'Профиль' : 'Войти'}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск модов по названию или автору..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <nav className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-muted/50">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="capitalize">
                  {cat === 'all' ? 'Все моды' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-1">
              {selectedCategory === 'all' ? 'Популярные моды' : selectedCategory}
            </h2>
            <p className="text-muted-foreground">
              Найдено: {filteredMods.length} {filteredMods.length === 1 ? 'мод' : 'модов'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Рейтинг
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="HelpCircle" size={16} className="mr-2" />
              FAQ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMods.map((mod) => (
            <Card 
              key={mod.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={mod.image} 
                  alt={mod.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
                  {mod.category}
                </Badge>
              </div>
              
              <CardHeader>
                <h3 className="font-heading font-semibold text-lg line-clamp-1">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="User" size={14} />
                  {mod.author}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Download" size={16} />
                    {mod.downloads.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Heart" size={16} />
                    {mod.likes + (likedMods.includes(mod.id) ? 1 : 0)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={16} />
                    {new Date(mod.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleDownload(mod.title)}
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  Скачать
                </Button>
                <Button 
                  variant={likedMods.includes(mod.id) ? "default" : "outline"}
                  size="icon"
                  onClick={() => handleLike(mod.id)}
                >
                  <Icon name="Heart" size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredMods.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-heading font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2024 Proton Bus Mods. Платформа для обмена модификациями</p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="hover:text-foreground transition-colors">О проекте</a>
            <a href="#" className="hover:text-foreground transition-colors">Правила</a>
            <a href="#" className="hover:text-foreground transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
