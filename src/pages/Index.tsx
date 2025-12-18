import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  description?: string;
  isUserMod?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  installPath?: string;
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
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
    description: 'Качественная модель автобуса Mercedes-Benz'
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
  const [currentUser, setCurrentUser] = useState('');
  const [likedMods, setLikedMods] = useState<number[]>([]);
  const [userMods, setUserMods] = useState<Mod[]>([]);
  
  const [newMod, setNewMod] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    file: null as File | null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const [editingMod, setEditingMod] = useState<Mod | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    file: null as File | null
  });
  const [editImagePreview, setEditImagePreview] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const categories = ['all', 'Автобусы', 'Карты', 'Скины'];

  const allMods = [...mockMods, ...userMods];
  
  const filteredMods = allMods.filter(mod => {
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

  const handleDownload = (mod: Mod) => {
    if (mod.fileUrl) {
      const link = document.createElement('a');
      link.href = mod.fileUrl;
      link.download = mod.fileName || `${mod.title}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      const updatedMods = userMods.map(m => {
        if (m.id === mod.id) {
          return { ...m, downloads: m.downloads + 1 };
        }
        return m;
      });
      setUserMods(updatedMods);
      
      toast.success(
        <div>
          <p className="font-semibold">Мод скачан!</p>
          <p className="text-sm mt-1">Установите в папку: {mod.installPath || 'Documents/ProtonBus/Mods'}</p>
        </div>
      );
    } else {
      toast.success(
        <div>
          <p className="font-semibold">Скачивание "{mod.title}" началось!</p>
          <p className="text-sm mt-1">Установите в: Documents/ProtonBus/Mods</p>
        </div>
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewMod({ ...newMod, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
        setEditData({ ...editData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!isRegistered) {
      toast.error('Необходима регистрация для загрузки модов');
      return;
    }
    if (!newMod.title || !newMod.category || !newMod.file) {
      toast.error('Заполните все поля и выберите файл');
      return;
    }

    const fileUrl = URL.createObjectURL(newMod.file);
    const fileSizeMB = (newMod.file.size / (1024 * 1024)).toFixed(2);

    const mod: Mod = {
      id: Date.now(),
      title: newMod.title,
      author: currentUser,
      category: newMod.category,
      downloads: 0,
      likes: 0,
      date: new Date().toISOString().split('T')[0],
      image: imagePreview || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
      description: newMod.description,
      isUserMod: true,
      fileUrl: fileUrl,
      fileName: newMod.file.name,
      fileSize: `${fileSizeMB} МБ`,
      installPath: 'Documents/ProtonBus/Mods'
    };

    setUserMods([mod, ...userMods]);
    toast.success('Мод успешно опубликован и готов к скачиванию!');
    
    setNewMod({ title: '', category: '', description: '', image: '', file: null });
    setImagePreview('');
    setIsUploadDialogOpen(false);
  };

  const handleEdit = (mod: Mod) => {
    setEditingMod(mod);
    setEditData({
      title: mod.title,
      category: mod.category,
      description: mod.description || '',
      image: mod.image,
      file: null
    });
    setEditImagePreview(mod.image);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMod) return;

    const updatedMods = userMods.map(mod => {
      if (mod.id === editingMod.id) {
        return {
          ...mod,
          title: editData.title,
          category: editData.category,
          description: editData.description,
          image: editImagePreview
        };
      }
      return mod;
    });

    setUserMods(updatedMods);
    toast.success('Мод успешно обновлен!');
    setIsEditDialogOpen(false);
    setEditingMod(null);
  };

  const handleDeleteMod = (modId: number) => {
    setUserMods(userMods.filter(mod => mod.id !== modId));
    toast.success('Мод удален');
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
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить мод
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
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
                              <Input 
                                id="username" 
                                placeholder="Введите имя"
                                onChange={(e) => setCurrentUser(e.target.value)}
                              />
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
                                if (currentUser) {
                                  setIsRegistered(true);
                                  toast.success('Регистрация успешна!');
                                } else {
                                  toast.error('Введите имя пользователя');
                                }
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
                        <Label htmlFor="modTitle">Название мода *</Label>
                        <Input 
                          id="modTitle" 
                          placeholder="Название" 
                          value={newMod.title}
                          onChange={(e) => setNewMod({ ...newMod, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Категория *</Label>
                        <Input 
                          id="category" 
                          placeholder="Автобусы, Карты, Скины..."
                          value={newMod.category}
                          onChange={(e) => setNewMod({ ...newMod, category: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Описание</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Описание мода..."
                          value={newMod.description}
                          onChange={(e) => setNewMod({ ...newMod, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Фото мода</Label>
                        <Input 
                          id="image" 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <div className="mt-3">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="file">Файл мода *</Label>
                        <Input 
                          id="file" 
                          type="file" 
                          onChange={(e) => setNewMod({ ...newMod, file: e.target.files?.[0] || null })}
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
                {isRegistered ? currentUser : 'Войти'}
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
                {mod.isUserMod && (
                  <Badge className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm">
                    Мой мод
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <h3 className="font-heading font-semibold text-lg line-clamp-1">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="User" size={14} />
                  {mod.author}
                </p>
                {mod.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {mod.description}
                  </p>
                )}
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
                  onClick={() => handleDownload(mod)}
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  {mod.fileSize ? `Скачать (${mod.fileSize})` : 'Скачать'}
                </Button>
                <Button 
                  variant={likedMods.includes(mod.id) ? "default" : "outline"}
                  size="icon"
                  onClick={() => handleLike(mod.id)}
                >
                  <Icon name="Heart" size={16} />
                </Button>
                {mod.isUserMod && (
                  <>
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(mod)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteMod(mod.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </>
                )}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать мод</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTitle">Название мода</Label>
              <Input 
                id="editTitle" 
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editCategory">Категория</Label>
              <Input 
                id="editCategory" 
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Описание</Label>
              <Textarea 
                id="editDescription" 
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editImage">Изменить фото</Label>
              <Input 
                id="editImage" 
                type="file" 
                accept="image/*"
                onChange={handleEditImageChange}
              />
              {editImagePreview && (
                <div className="mt-3">
                  <img 
                    src={editImagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveEdit}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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