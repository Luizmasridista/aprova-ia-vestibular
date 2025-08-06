import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import AnimatedCalendar from './AnimatedCalendar';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  sendToBackOnClick?: boolean;
  cardsData?: { id: number; img: string; title: string; description: string; features: string[] }[];
  animationConfig?: { stiffness: number; damping: number };
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 320, height: 400 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
}: StackProps) {
  const [cards, setCards] = useState(
    cardsData.length
      ? cardsData
      : [
          {
            id: 1,
            img: "/LOGO-NOVA-APROVA.png",
            title: "APRU 1b",
            description: "Assistente de IA rápido e eficiente para respostas instantâneas",
            features: ["Respostas em tempo real", "Análise de questões", "Dicas personalizadas"]
          },
          {
            id: 2,
            img: "/LOGO-NOVA-APROVA.png",
            title: "APRU REASONING",
            description: "IA avançada com raciocínio profundo para análises complexas",
            features: ["Raciocínio avançado", "Explicações detalhadas", "Resolução passo a passo"]
          },
          {
            id: 3,
            img: "/LOGO-NOVA-APROVA.png",
            title: "APRU CALENDAR",
            description: "Assistente especializado em organização e planejamento de estudos",
            features: ["Planejamento inteligente", "Lembretes automáticos", "Otimização de tempo"]
          },
          {
            id: 4,
            img: "/LOGO-NOVA-APROVA.png",
            title: "APRU EXERCISE",
            description: "Gerador de exercícios personalizados com base no seu desempenho",
            features: ["Exercícios adaptativos", "Correção automática", "Feedback inteligente"]
          },
        ]
  );

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  return (
    <div
      className="relative mx-auto"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
          >
            <motion.div
                className="rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white transition-all duration-300 hover:shadow-3xl"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
              }}
            >
              {/* Header com conteúdo específico para cada agente */}
              <div className="relative h-32 overflow-hidden">
                {/* Gradiente de fundo específico para cada agente */}
                <div className={`absolute inset-0 ${
                  card.id === 1 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                  card.id === 2 ? 'bg-gradient-to-br from-purple-600 to-pink-500' :
                  card.id === 3 ? 'bg-gradient-to-br from-green-500 to-blue-500' :
                  'bg-gradient-to-br from-orange-500 to-red-500'
                }`} />
                
                {/* Conteúdo específico por agente */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {card.id === 1 && (
                    // APRU 1b - Ícone oficial SVG
                    <img 
                      src="/apru-1b-icon.svg" 
                      alt="APRU 1b" 
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-90 drop-shadow-lg"
                    />
                  )}
                  {card.id === 2 && (
                    // APRU Reasoning - Ícone oficial SVG
                    <img 
                      src="/apru-reasoning-icon.svg" 
                      alt="APRU Reasoning" 
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-90 drop-shadow-lg"
                    />
                  )}
                  {card.id === 3 && (
                    // APRU Calendar - Calendário animado responsivo
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <AnimatedCalendar 
                        size="small" 
                        showEvents={true}
                        className="drop-shadow-lg scale-75 sm:scale-90 md:scale-100" 
                      />
                    </div>
                  )}
                  {card.id === 4 && (
                    // APRU Exercise - Ícone oficial SVG
                    <img 
                      src="/apru-exercise-icon.svg" 
                      alt="APRU Exercise" 
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-90 drop-shadow-lg"
                    />
                  )}
                </div>
                
                {/* Overlay escuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Título */}
                <div className="absolute bottom-2 left-3 right-3 text-white font-bold text-sm sm:text-base md:text-lg drop-shadow-lg">
                  <span className="bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                    {card.title}
                  </span>
                </div>
              </div>
              
              {/* Conteúdo */}
              <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {card.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">Principais recursos:</h4>
                  <ul className="space-y-1">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Badge */}
                <div className="flex justify-center pt-2">
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm">
                    ✨ Powered by AI
                  </span>
                </div>
              </div>
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}