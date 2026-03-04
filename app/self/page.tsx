'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SelfPage() {
  const router = useRouter();
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('siltare_visited');
    if (visited === 'true') {
      // 재방문: 바로 이야기 생성 후 이동
      setIsFirstVisit(false);
      createAndRedirect();
    } else {
      // 첫 방문: 온보딩 화면
      setIsFirstVisit(true);
    }
  }, []);

  const createAndRedirect = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/create-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'self',
          interviewee: { name: '나' },
          context: ['나의 이야기'],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create');
      }

      const data = await res.json();
      router.push(`/interview/${data.id}`);
    } catch (err) {
      console.error('Failed to create self interview:', err);
      setIsCreating(false);
      alert('생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleStartClick = () => {
    localStorage.setItem('siltare_visited', 'true');
    createAndRedirect();
  };

  // 로딩 중이거나 첫 방문 판단 전
  if (isFirstVisit === null || isCreating) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF6F0',
        color: '#2C2418'
      }}>
        {isCreating ? '준비 중...' : ''}
      </div>
    );
  }

  // 온보딩 화면
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        :root {
          --bg: #FAF6F0;
          --text: #2C2418;
          --accent: #C4956A;
          --secondary: #8B7355;
          --muted: #9E9585;
          --card: #FFFDF9;
          --border: #E8E0D4;
          --dark: #1a1410;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Noto Sans KR', sans-serif;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        background: '#FAF6F0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px 60px'
      }}>
        {/* Header */}
        <header style={{
          width: '100%',
          maxWidth: '520px',
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            fontFamily: '"Noto Serif KR", serif',
            fontSize: '16px',
            color: '#2C2418',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🧵 실타래
          </Link>
        </header>

        <div style={{
          width: '100%',
          maxWidth: '520px',
          paddingTop: '20px'
        }}>
          {/* Step Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#E8E0D4',
            color: '#8B7355',
            fontSize: '12px',
            fontFamily: '"Noto Sans KR", sans-serif',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '24px',
            letterSpacing: '0.02em'
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#C4956A'
            }}></span>
            첫 번째 시간
          </div>

          {/* Why Section */}
          <div style={{
            marginBottom: '40px',
            opacity: 0,
            transform: 'translateY(16px)',
            animation: 'fadeUp 0.6s ease forwards'
          }}>
            <h1 style={{
              fontFamily: '"Noto Serif KR", serif',
              fontSize: '26px',
              fontWeight: 400,
              lineHeight: 1.5,
              color: '#2C2418',
              marginBottom: '20px',
              wordBreak: 'keep-all'
            }}>
              말하다 보면<br/>
              <em style={{
                fontStyle: 'italic',
                color: '#C4956A',
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '30px'
              }}>보입니다.</em>
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '🪞', title: '나를 제3자 관점으로 바라보게 됩니다', desc: '살면서 한 번도 스스로에게 하지 못했던 질문들을 받게 됩니다. 내 이야기를 타인에게 들려주듯 말하다 보면, 비로소 보이지 않던 것들이 보입니다.', delay: '0.15s' },
                { icon: '🧭', title: 'AI가 당신 삶의 패턴을 찾아줍니다', desc: '자주 쓴 단어, 가장 오래 머문 주제, 말하다 멈춘 순간들. AI가 당신도 몰랐던 인생의 테마와 반복되는 선택의 이유를 읽어냅니다.', delay: '0.25s' },
                { icon: '📖', title: '총 10시간의 대화가 한 권의 책이 됩니다', desc: '10분씩 나눠서 해도 됩니다. 대화가 쌓일수록 챕터가 완성되고, 10챕터가 모이면 세상에 하나뿐인 당신의 자서전이 됩니다.', delay: '0.35s' }
              ].map((card, i) => (
                <div key={i} style={{
                  background: '#FFFDF9',
                  border: '1px solid #E8E0D4',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  opacity: 0,
                  transform: 'translateY(12px)',
                  animation: `fadeUp 0.6s ease ${card.delay} forwards`
                }}>
                  <div style={{ fontSize: '20px', lineHeight: 1, marginTop: '2px', flexShrink: 0 }}>{card.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Noto Serif KR", serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#2C2418',
                      marginBottom: '4px'
                    }}>{card.title}</div>
                    <div style={{
                      fontSize: '13px',
                      color: '#9E9585',
                      lineHeight: 1.6,
                      wordBreak: 'keep-all'
                    }}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposition Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFDF9',
            border: '1px solid #E8E0D4',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            opacity: 0,
            animation: 'fadeUp 0.6s ease 0.45s forwards'
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '22px',
                color: '#C4956A',
                fontWeight: 400,
                marginBottom: '4px'
              }}>10시간</div>
              <div style={{
                fontSize: '11px',
                color: '#9E9585',
                lineHeight: 1.5
              }}>대화하면<br/>책 한 권</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: '#E8E0D4', flexShrink: 0 }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '22px',
                color: '#C4956A',
                fontWeight: 400,
                marginBottom: '4px'
              }}>10분</div>
              <div style={{
                fontSize: '11px',
                color: '#9E9585',
                lineHeight: 1.5
              }}>씩 나눠서<br/>해도 됩니다</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: '#E8E0D4', flexShrink: 0 }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '22px',
                color: '#C4956A',
                fontWeight: 400,
                marginBottom: '4px'
              }}>AI</div>
              <div style={{
                fontSize: '11px',
                color: '#9E9585',
                lineHeight: 1.5
              }}>심리분석<br/>포함</div>
            </div>
          </div>

          <div style={{ height: '1px', background: '#E8E0D4', margin: '32px 0' }}></div>

          {/* How Section */}
          <div style={{
            marginBottom: '40px',
            opacity: 0,
            animation: 'fadeUp 0.6s ease 0.4s forwards'
          }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9E9585',
              marginBottom: '16px',
              fontFamily: '"Noto Sans KR", sans-serif'
            }}>이렇게 진행됩니다</div>

            <div style={{
              background: '#FFFDF9',
              border: '1px solid #E8E0D4',
              borderRadius: '12px',
              padding: '24px 20px'
            }}>
              <div style={{
                fontFamily: '"Noto Serif KR", serif',
                fontSize: '15px',
                color: '#2C2418',
                marginBottom: '20px',
                fontWeight: 400
              }}>당신의 책, 지금 시작됩니다</div>

              {/* Chapter Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                  <div key={num} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '2/3',
                      borderRadius: '3px',
                      border: num === 1 ? '1.5px solid #C4956A' : '1.5px solid #E8E0D4',
                      background: num === 1 ? '#C4956A' : '#FAF6F0',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: num === 1 ? '0 4px 12px rgba(196, 149, 106, 0.35)' : 'none'
                    }}>
                      {num === 1 && <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)'
                      }}></div>}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: num === 1 ? '#C4956A' : '#9E9585',
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: num === 1 ? 500 : 400
                    }}>{num}장</div>
                  </div>
                ))}
              </div>

              {/* Session Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#9E9585',
                  width: '60px',
                  flexShrink: 0
                }}>1장 진도</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1,2,3,4,5].map((n) => (
                    <div key={n} style={{
                      width: '28px',
                      height: '8px',
                      borderRadius: '4px',
                      background: n === 1 ? '#C4956A' : '#E8E0D4',
                      boxShadow: n === 1 ? '0 0 8px rgba(196, 149, 106, 0.5)' : 'none'
                    }}></div>
                  ))}
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                color: '#9E9585',
                lineHeight: 1.5,
                wordBreak: 'keep-all'
              }}>10분씩 3~5번 대화하면 1장이 완성됩니다</div>

              {/* Flow Steps */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #E8E0D4'
              }}>
                {[
                  { num: 1, main: '오늘 10분, 이야기를 시작합니다', sub: '어린 시절 첫 기억부터', highlight: true },
                  { num: 2, main: '대화가 쌓이면 챕터 초고가 생성됩니다', sub: 'AI가 당신의 말을 자서전 문체로 정리합니다', highlight: false },
                  { num: 3, main: '당신만의 챕터 구성이 만들어집니다', sub: 'AI가 당신 인생의 무게중심을 파악해 제안합니다', highlight: false },
                  { num: 4, main: '10챕터가 모이면 한 권의 책이 됩니다', sub: '세상에 하나뿐인 당신의 자서전', highlight: false }
                ].map((step, i, arr) => (
                  <div key={step.num} style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '10px 0',
                    position: 'relative'
                  }}>
                    {i < arr.length - 1 && <div style={{
                      content: '',
                      position: 'absolute',
                      left: '14px',
                      top: '32px',
                      bottom: 0,
                      width: '1px',
                      background: '#E8E0D4'
                    }}></div>}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: step.highlight ? '#C4956A' : '#E8E0D4',
                      color: step.highlight ? 'white' : '#8B7355',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 400
                    }}>{step.num}</div>
                    <div style={{ paddingTop: '4px' }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#2C2418',
                        marginBottom: '2px',
                        fontFamily: '"Noto Serif KR", serif',
                        fontWeight: 400
                      }}>{step.main}</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#9E9585'
                      }}>{step.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today Section */}
          <div style={{
            background: 'linear-gradient(135deg, #2C2418, #1a1410)',
            borderRadius: '12px',
            padding: '24px 20px',
            marginBottom: '32px',
            opacity: 0,
            animation: 'fadeUp 0.6s ease 0.5s forwards',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              content: '1',
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '80px',
              color: 'rgba(196, 149, 106, 0.15)',
              lineHeight: 1,
              pointerEvents: 'none'
            }}>1</div>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#C4956A',
              marginBottom: '10px',
              fontFamily: '"Noto Sans KR", sans-serif'
            }}>오늘 할 것</div>
            <div style={{
              fontFamily: '"Noto Serif KR", serif',
              fontSize: '20px',
              color: '#FAF6F0',
              fontWeight: 400,
              marginBottom: '8px',
              lineHeight: 1.4
            }}>1장 · 첫 번째 대화<br/>뿌리 - 가장 이른 기억</div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(250, 246, 240, 0.55)',
              lineHeight: 1.6,
              wordBreak: 'keep-all',
              maxWidth: '260px'
            }}>어린 시절 가장 먼저 떠오르는 장면부터 시작합니다. 약 10분.</div>
          </div>

          {/* CTA */}
          <div style={{
            opacity: 0,
            animation: 'fadeUp 0.6s ease 0.6s forwards'
          }}>
            <button
              onClick={handleStartClick}
              disabled={isCreating}
              style={{
                width: '100%',
                padding: '18px',
                background: '#2C2418',
                color: '#FAF6F0',
                border: 'none',
                borderRadius: '6px',
                fontFamily: '"Noto Serif KR", serif',
                fontSize: '16px',
                fontWeight: 400,
                cursor: isCreating ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                marginBottom: '12px',
                opacity: isCreating ? 0.6 : 1
              }}
            >
              {isCreating ? '준비 중...' : '지금 시작하기'}
            </button>
            <div style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#9E9585',
              lineHeight: 1.5
            }}>가입 없이 바로 시작됩니다 · 언제든 이어할 수 있습니다</div>
          </div>
        </div>
      </div>
    </>
  );
}
