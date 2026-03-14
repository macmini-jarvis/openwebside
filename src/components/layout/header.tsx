"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu, Plus, LogOut, User, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import type { UserProfile } from "@/types/database";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        setProfile(data);
      }
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.refresh();
  };

  const isAdmin = user?.email === "openwebside@gmail.com";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="text-primary">OpenWebSide</span>
        </Link>

        {/* 카테고리 드롭다운 — 데스크탑 */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="hidden md:flex" />}>
            카테고리
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {CATEGORIES.map((cat) => (
              <DropdownMenuItem
                key={cat.slug}
                render={<Link href={`/category/${cat.slug}`} />}
              >
                {cat.icon} {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 검색바 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="웹사이트 검색..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/contact"
            className="hidden md:inline text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            문의
          </Link>
          {user ? (
            <>
              <Button
                render={<Link href="/products/new" />}
                size="sm"
                className="hidden md:flex"
              >
                <Plus className="h-4 w-4 mr-1" />
                등록하기
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon" className="rounded-full" />}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback>
                      {profile?.nickname?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {profile?.nickname ?? user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/products/new" />}>
                    <Plus className="h-4 w-4 mr-2" />
                    사이트 등록
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href={`/?user=${user.id}`} />}>
                    <User className="h-4 w-4 mr-2" />
                    내 등록 사이트
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem render={<Link href="/admin" />}>
                      <Shield className="h-4 w-4 mr-2" />
                      관리자
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" onClick={handleLogin}>
              로그인
            </Button>
          )}

          {/* 모바일 메뉴 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="웹사이트 검색..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
                {user && (
                  <Button
                    render={<Link href="/products/new" />}
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    사이트 등록
                  </Button>
                )}
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    render={<Link href="/contact" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    문의하기
                  </Button>
                  <p className="text-sm font-medium text-muted-foreground px-2">
                    카테고리
                  </p>
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.slug}
                      variant="ghost"
                      className="w-full justify-start"
                      render={<Link href={`/category/${cat.slug}`} />}
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.icon} {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
