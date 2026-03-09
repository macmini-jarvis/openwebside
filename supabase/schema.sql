-- OpenWebSide DB Schema
-- Supabase SQL Editor에서 실행

-- 사용자 프로필
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 제품 (웹사이트)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  avg_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 리뷰
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- 추천 (좋아요)
CREATE TABLE IF NOT EXISTS upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- 사이트 인증
CREATE TABLE IF NOT EXISTS site_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed'))
);

-- 추천 수 증가/감소 함수
CREATE OR REPLACE FUNCTION increment_upvote(p_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET upvote_count = upvote_count + 1 WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_upvote(p_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET upvote_count = GREATEST(upvote_count - 1, 0) WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS (Row Level Security) 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_verifications ENABLE ROW LEVEL SECURITY;

-- users: 누구나 읽기, 본인만 수정
CREATE POLICY "users_read" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update" ON users FOR UPDATE USING (auth.uid() = id);

-- products: 승인된 것은 누구나 읽기, 로그인 사용자 등록, 본인만 수정
CREATE POLICY "products_read_approved" ON products FOR SELECT USING (
  status = 'approved' OR auth.uid() = user_id OR auth.jwt() ->> 'email' = 'openwebside@gmail.com'
);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_update" ON products FOR UPDATE USING (
  auth.uid() = user_id OR auth.jwt() ->> 'email' = 'openwebside@gmail.com'
);

-- reviews: 누구나 읽기, 로그인 사용자 작성, 본인만 수정/삭제
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- upvotes: 누구나 읽기, 로그인 사용자 추가/삭제
CREATE POLICY "upvotes_read" ON upvotes FOR SELECT USING (true);
CREATE POLICY "upvotes_insert" ON upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "upvotes_delete" ON upvotes FOR DELETE USING (auth.uid() = user_id);

-- site_verifications: 본인 제품만 접근, 관리자 전체 접근
CREATE POLICY "verifications_read" ON site_verifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM products WHERE products.id = product_id AND products.user_id = auth.uid())
  OR auth.jwt() ->> 'email' = 'openwebside@gmail.com'
);
CREATE POLICY "verifications_insert" ON site_verifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM products WHERE products.id = product_id AND products.user_id = auth.uid())
);
CREATE POLICY "verifications_update" ON site_verifications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM products WHERE products.id = product_id AND products.user_id = auth.uid())
  OR auth.jwt() ->> 'email' = 'openwebside@gmail.com'
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_product_id ON upvotes(product_id);
