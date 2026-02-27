'use client';

import { useState } from 'react';
import { HeroBackgroundCanvas } from '@/components/effects/hero-background-canvas';
import { useParams } from 'next/navigation';

export default function BackgroundPreviewPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'zh';
  const isChina = locale === 'zh';
  const [selectedEffect, setSelectedEffect] = useState<string>('HERO');

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          {isChina ? '背景效果预览' : 'Background Effect Preview'}
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {isChina ? '点击下方按钮切换不同效果' : 'Click buttons below to switch effects'}
        </p>

        {/* Effect Selector */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {['HERO', 'A', 'B', 'C', 'D', 'E', 'F'].map((effect) => (
            <button
              key={effect}
              onClick={() => setSelectedEffect(effect)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedEffect === effect
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {getEffectName(effect, isChina)}
            </button>
          ))}
        </div>

        {/* Effect Description */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{getEffectName(selectedEffect, isChina)}</h2>
          <p className="text-gray-400">{getEffectDescription(selectedEffect, isChina)}</p>
        </div>

        {/* Preview Area */}
        <div className="relative rounded-xl overflow-hidden border-4 border-gray-700" style={{ height: '600px' }}>
          {renderEffect(selectedEffect)}

          {/* Content Overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {isChina ? '精选擂台区' : 'Featured Arena'}
              </h3>
              <p className="text-2xl text-gray-200 drop-shadow-md">
                {isChina ? '这里展示3个精选的AI实战方案' : '3 Featured AI Solutions'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getEffectName(effect: string, isChina: boolean): string {
  const names: Record<string, { zh: string; en: string }> = {
    'HERO': { zh: '1.1 Hero: 脉冲+连接线', en: '1.1 Hero: Pulse + Connection' },
    'A': { zh: '方案A: 流动渐变', en: 'Plan A: Flowing Gradient' },
    'B': { zh: '方案B: 六边形网格', en: 'Plan B: Hexagon Grid' },
    'C': { zh: '方案C: 数据流', en: 'Plan C: Data Flow' },
    'D': { zh: '方案D: 几何图形', en: 'Plan D: Geometric Shapes' },
    'E': { zh: '方案E: 扫描光效', en: 'Plan E: Scan Line' },
    'F': { zh: '方案F: 粒子星云', en: 'Plan F: Particle Nebula' }
  };
  return names[effect]?.[isChina ? 'zh' : 'en'] || effect;
}

function getEffectDescription(effect: string, isChina: boolean): string {
  const descriptions: Record<string, { zh: string; en: string }> = {
    'HERO': {
      zh: '1.1 Hero区效果 - 深色渐变背景 + 中心蓝色脉冲 + 粒子连接网络 + 数据流点，强烈的科技感和未来感',
      en: '1.1 Hero Effect - Dark gradient + center blue pulse + particle network + data points, strong tech feel'
    },
    'A': {
      zh: '流动渐变背景 - 使用CSS动画创建流动的多色渐变效果，色彩平滑过渡，性能优异，适合现代科技感',
      en: 'Flowing Gradient - CSS animated flowing multi-color gradient, smooth transitions, high performance'
    },
    'B': {
      zh: '六边形网格动画 - 动态六边形图案，带有淡入淡出效果，蜂窝状布局，强烈的科技感和未来感',
      en: 'Hexagon Grid - Dynamic hexagonal pattern with fade effects, honeycomb layout, futuristic'
    },
    'C': {
      zh: '数据流效果 - 垂直流动的数字和字符流，类似黑客帝国的代码雨效果，充满未来科技感',
      en: 'Data Flow - Vertical streaming numbers and characters, Matrix-style code rain effect'
    },
    'D': {
      zh: '浮动几何图形 - 简单的几何图形（三角形、正方形、圆形）缓慢旋转和移动，轻量级动态效果',
      en: 'Floating Geometry - Simple shapes (triangle, square, circle) slowly rotating and moving'
    },
    'E': {
      zh: '扫描光效 - 水平扫描线从上到下移动，带有光晕效果，简洁但有效，科技扫描感',
      en: 'Scan Line - Horizontal scan line moving top to bottom with glow, clean and effective'
    },
    'F': {
      zh: '粒子星云（白色背景）- 轻量粒子效果，蓝色粒子缓慢漂浮和闪烁，清新科技感，优雅且不抢眼',
      en: 'Particle Nebula - Lightweight particle effect, blue particles floating and twinkling, elegant'
    }
  };
  return descriptions[effect]?.[isChina ? 'zh' : 'en'] || '';
}

function renderEffect(effect: string) {
  switch (effect) {
    case 'HERO':
      return <HeroBackgroundCanvas />;
    case 'A':
      return <GradientBackground />;
    case 'B':
      return <HexagonGridBackground />;
    case 'C':
      return <DataFlowBackground />;
    case 'D':
      return <GeometricBackground />;
    case 'E':
      return <ScanLineBackground />;
    case 'F':
      return <ParticleNebulaBackground />;
    default:
      return <HeroBackgroundCanvas />;
  }
}

// Effect A: 流动渐变背景
function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient-flow"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 animate-gradient-flow-reverse opacity-50"></div>
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 8s ease infinite;
        }
        .animate-gradient-flow-reverse {
          background-size: 200% 200%;
          animation: gradient-flow 10s ease infinite reverse;
        }
      `}</style>
    </div>
  );
}

// Effect B: 六边形网格
function HexagonGridBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute hexagon"
            style={{
              left: `${(i % 10) * 10}%`,
              top: `${Math.floor(i / 10) * 20}%`,
              animationDelay: `${i * 0.1}s`
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path
                d="M30 0 L56 15 L56 45 L30 60 L4 45 L4 15 Z"
                fill="none"
                stroke="rgba(100, 200, 255, 0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}
      </div>
      <style>{`
        .hexagon {
          animation: hexagon-pulse 3s ease-in-out infinite;
        }
        @keyframes hexagon-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// Effect C: 数据流
function DataFlowBackground() {
  return (
    <div className="absolute inset-0 bg-black">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="data-stream"
            style={{
              left: `${(i * 3.33)}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {Array(20).fill(0).map((_, j) => (
              <div key={j} className="text-green-500 text-xs font-mono opacity-70">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        .data-stream {
          position: absolute;
          top: -100%;
          animation: data-flow 5s linear infinite;
        }
        @keyframes data-flow {
          0% { transform: translateY(0); }
          100% { transform: translateY(800px); }
        }
      `}</style>
    </div>
  );
}

// Effect D: 浮动几何图形
function GeometricBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {[...Array(15)].map((_, i) => {
        const shapes = ['triangle', 'square', 'circle'];
        const shape = shapes[i % 3];
        return (
          <div
            key={i}
            className={`geometric-${shape}`}
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              width: `${30 + Math.random() * 40}px`,
              height: `${30 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3
            }}
          />
        );
      })}
      <style>{`
        .geometric-triangle {
          position: absolute;
          background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: geometric-float 6s ease-in-out infinite;
        }
        .geometric-square {
          position: absolute;
          background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
          animation: geometric-rotate 8s linear infinite;
        }
        .geometric-circle {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
          border-radius: 50%;
          animation: geometric-float 7s ease-in-out infinite;
        }
        @keyframes geometric-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes geometric-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Effect E: 扫描光效
function ScanLineBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="scan-line"
            style={{
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>
      <style>{`
        .scan-line {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg,
            transparent,
            rgba(100, 200, 255, 0.8),
            rgba(255, 255, 255, 1),
            rgba(100, 200, 255, 0.8),
            transparent
          );
          animation: scan-move 4s ease-in-out infinite;
          filter: blur(1px);
        }
        @keyframes scan-move {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Effect F: 粒子星云（白色背景+蓝色粒子）
function ParticleNebulaBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="particle-blue"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      <style>{`
        .particle-blue {
          position: absolute;
          background: rgb(59, 130, 246);
          border-radius: 50%;
          animation: particle-float-blue 4s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
                      0 0 20px rgba(59, 130, 246, 0.3);
        }
        @keyframes particle-float-blue {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
