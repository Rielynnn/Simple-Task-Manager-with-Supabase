# 📚 Task Manager App (React + Supabase)

A simple CRUD task manager built with **React (Vite)** and **Supabase**.
Supports authentication, task management, and image uploads.

---

## 🚀 Features

* 🔐 User authentication (Sign up / Sign in)
* 📝 Create, read, update, delete tasks
* 🖼 Upload images for each task
* 👤 User-specific data (each user sees their own tasks)
* ⚡ Real-time backend powered by Supabase

---

## 🛠 Tech Stack

* **Frontend**: React (Vite)
* **Backend / DB**: Supabase (PostgreSQL)
* **Storage**: Supabase Storage (for images)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## ▶️ Running the app

```bash
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 🗄 Database Setup (Supabase)

Create a table:

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text,
  description text,
  image_url text,
  created_at timestamp default now()
);
```

---

## 📁 Storage Setup

1. Go to Supabase Dashboard → Storage
2. Create bucket: `task-images`
3. Set bucket to **public**

---

## 🔐 Row Level Security (RLS)

Enable RLS and add policy:

```sql
create policy "Users can access their own tasks"
on tasks
for all
using (auth.uid() = user_id);
```

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── Auth.jsx
 │   └── TaskManager.jsx
 ├── utils/
 │   └── supabase.js
 ├── App.jsx
 └── App.css
```

---

## ⚠️ Important Notes

* Make sure storage bucket is public for images to display

---

## 🧠 Known Limitations

* No pagination (all tasks loaded at once)
* No edit mode toggle (always visible)
* Basic UI (no advanced styling yet)

MIT License
