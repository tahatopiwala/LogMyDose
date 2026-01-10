import React from 'react';
import { PlayCircle, BookOpen, Clock, Award } from 'lucide-react';

export const LearnTab: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Injection Technique Basics',
      description: 'Learn proper subcutaneous injection methods',
      duration: '8 min',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      progress: 100,
      completed: true,
    },
    {
      id: 2,
      title: 'Peptide Storage & Handling',
      description: 'Best practices for maintaining peptide potency',
      duration: '6 min',
      thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
      progress: 60,
      completed: false,
    },
    {
      id: 3,
      title: 'Understanding BPC-157',
      description: 'Deep dive into healing peptides',
      duration: '12 min',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
      progress: 0,
      completed: false,
    },
    {
      id: 4,
      title: 'GLP-1 Agonists Explained',
      description: 'How metabolic peptides work',
      duration: '15 min',
      thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
      progress: 0,
      completed: false,
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'Maximizing Your Peptide Protocol',
      readTime: '5 min read',
      category: 'Wellness',
    },
    {
      id: 2,
      title: 'Nutrition Tips During Therapy',
      readTime: '4 min read',
      category: 'Nutrition',
    },
    {
      id: 3,
      title: 'Sleep & Recovery Optimization',
      readTime: '6 min read',
      category: 'Lifestyle',
    },
  ];

  return (
    <div className="pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Learn</h1>
        <p className="text-slate-500">Educational resources for your journey</p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Award className="w-6 h-6" />
          <span className="font-semibold">Your Progress</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
          <span className="text-sm font-medium">1/4 Complete</span>
        </div>
      </div>

      {/* Video Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Video Courses</h2>
          <button className="text-sm text-blue-600 font-medium">See All</button>
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex"
            >
              <div className="relative w-28 h-28 flex-shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                {course.completed && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 rounded-full">
                    <span className="text-xs text-white font-medium">Done</span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{course.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </div>
                {course.progress > 0 && course.progress < 100 && (
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Articles</h2>
          <button className="text-sm text-blue-600 font-medium">See All</button>
        </div>

        <div className="space-y-3">
          {articles.map((article) => (
            <button
              key={article.id}
              className="w-full bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">{article.title}</h3>
                <p className="text-sm text-slate-500">
                  {article.category} &bull; {article.readTime}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
