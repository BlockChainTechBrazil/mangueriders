import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Icons } from "@/components/ui/icons";

// Componente Hero
export const HeroSection = () => {
  return (
    <motion.section
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Slogan animado acima da moeda */}
      <motion.div
        className="absolute top-1/4 left-0 right-0 transform -translate-y-full z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white filter drop-shadow-glow px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20">
          <motion.span
            className="bg-gradient-to-r from-gaya-primary via-gaya-accent to-gaya-secondary bg-clip-text text-transparent inline-block"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            Nunca foi tão bom receber uma gaya
          </motion.span>
        </h2>
      </motion.div>

      {/* Cores animadas de carnaval */}
      <motion.div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {/* Círculos animados com cores de carnaval */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gaya-primary/30 blur-3xl"
          style={{ top: "10%", left: "20%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gaya-secondary/30 blur-3xl"
          style={{ top: "30%", right: "15%" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-gaya-accent/30 blur-3xl"
          style={{ bottom: "20%", left: "30%" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-gaya-complementary-pink/30 blur-3xl"
          style={{ bottom: "15%", right: "25%" }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </motion.div>

      <div className="backdrop-blur-sm bg-black/30 p-6 rounded-xl max-w-3xl">
        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gaya-primary via-gaya-complementary-pink to-gaya-secondary bg-clip-text text-transparent"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          GAYA
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mt-4 text-white"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          A memecoin do{" "}
          <span className="text-gaya-accent font-semibold">Recife</span> para o
          mundo
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-gaya-primary hover:bg-gaya-primary-dark group"
          >
            <span>Comprar GAYA</span>
            <motion.span
              className="ml-2"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              🚀
            </motion.span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 backdrop-blur-sm text-white hover:bg-white/10"
              >
                Saiba Mais
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gaya-darkGray to-black text-white border-gaya-primary">
              <DialogHeader>
                <DialogTitle className="text-gaya-accent">
                  GAYA - A Memecoin Recifense
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  Inspirada no ditado "Em Recife só tem corno, todo mundo tem
                  gaia".
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>
                  GAYA capitaliza no humor e na identificação cultural de Recife
                  para criar uma memecoin divertida e vibrante como a cidade que
                  a inspirou.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 1,
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <p className="text-white/70 text-sm">
          Role para baixo para descobrir mais
        </p>
      </motion.div>
    </motion.section>
  );
};

// Componente Sobre
export const AboutSection = () => {
  return (
    <motion.section
      className="min-h-screen w-full flex items-center justify-center px-4 py-20 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-black/40 p-8 rounded-xl max-w-4xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gaya-accent mb-6"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          O que é GAYA?
        </motion.h2>

        <motion.div
          className="space-y-6 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg">
            GAYA é uma memecoin inspirada no humor e na cultura vibrante de
            Recife, Pernambuco. Baseada no ditado popular{" "}
            <span className="italic text-gaya-primary">
              "Em Recife só tem corno, todo mundo tem gaia"
            </span>
            , a GAYA transforma um elemento cultural em uma oportunidade de
            investimento divertida.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-black/60 border-gaya-primary/30 text-white">
              <CardHeader>
                <CardTitle className="text-gaya-primary">Humor Local</CardTitle>
                <CardDescription className="text-white/70">
                  Baseada na cultura pernambucana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Transformando um elemento do humor local em um token divertido
                  e com potencial viral.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-gaya-secondary/30 text-white">
              <CardHeader>
                <CardTitle className="text-gaya-secondary">
                  Comunidade
                </CardTitle>
                <CardDescription className="text-white/70">
                  Construída pelos recifenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Uma memecoin criada pela comunidade e para a comunidade, com
                  foco na inclusão e diversão.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-gaya-accent/30 text-white">
              <CardHeader>
                <CardTitle className="text-gaya-accent">Potencial</CardTitle>
                <CardDescription className="text-white/70">
                  De Recife para o Brasil e o mundo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Com uma narrativa forte e identidade cultural única, GAYA tem
                  potencial de crescimento significativo.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Componente Tokenomics
export const TokenomicsSection = () => {
  const tokenomics = [
    {
      name: "Liquidez",
      percentage: 40,
      color: "from-gaya-secondary to-gaya-blue",
    },
    {
      name: "Marketing",
      percentage: 20,
      color: "from-gaya-primary to-gaya-pink",
    },
    {
      name: "Equipe",
      percentage: 15,
      color: "from-gaya-accent to-gaya-warning",
    },
    {
      name: "Desenvolvimento",
      percentage: 15,
      color: "from-gaya-green to-gaya-info",
    },
    { name: "Reserva", percentage: 10, color: "from-gaya-purple to-gaya-pink" },
  ];

  return (
    <motion.section
      className="min-h-screen w-full flex items-center justify-center px-4 py-20 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-black/40 p-8 rounded-xl max-w-4xl w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gaya-accent mb-6"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Tokenomics
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="space-y-6"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-white space-y-3">
              <p className="text-lg">
                Supply Total:{" "}
                <span className="text-gaya-accent font-bold">
                  1,000,000,000 GAYA
                </span>
              </p>
              <p className="text-lg">
                Taxa de Transação:{" "}
                <span className="text-gaya-accent font-bold">2%</span>
              </p>
              <p className="text-lg">
                Blockchain:{" "}
                <span className="text-gaya-accent font-bold">BNB Chain</span>
              </p>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-gaya-primary hover:bg-gaya-primary-dark"
              >
                Ver Contrato
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {tokenomics.map((item, index) => (
              <motion.div
                key={`tokenomic-${index}`}
                className="relative"
                initial={{ width: "0%" }}
                whileInView={{ width: `100%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
              >
                <div className="flex justify-between items-center mb-1 text-white">
                  <span>{item.name}</span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
                <div className="h-6 bg-black/60 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.9 + index * 0.1,
                      duration: 0.6 + item.percentage / 100,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Componente Roadmap
export const RoadmapSection = () => {
  const roadmapItems = [
    {
      phase: "Fase 1",
      title: "Lançamento",
      items: [
        "Criação do Website",
        "Desenvolvimento do Token",
        "Lançamento nas redes sociais",
        "Primeiras parcerias com influenciadores recifenses",
      ],
    },
    {
      phase: "Fase 2",
      title: "Crescimento",
      items: [
        "Listagem em exchanges descentralizadas",
        "Expansão da comunidade",
        "Eventos em Recife",
        "Programa de embaixadores",
      ],
    },
    {
      phase: "Fase 3",
      title: "Expansão",
      items: [
        "Listagem em exchanges centralizadas",
        "Desenvolvimento de produtos relacionados",
        "Parcerias com marcas locais",
        "Implementação de staking",
      ],
    },
    {
      phase: "Fase 4",
      title: "Evolução",
      items: [
        "Criação de DAO para governança",
        "Expansão para projetos beneficentes em Recife",
        "Eventos internacionais",
        "Novos casos de uso para o token",
      ],
    },
  ];

  return (
    <motion.section
      className="min-h-screen w-full flex items-center justify-center px-4 py-20 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-black/40 p-8 rounded-xl max-w-5xl w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gaya-accent mb-6 text-center"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Roadmap
        </motion.h2>

        <div className="relative mt-16">
          <div className="absolute top-0 left-1/2 w-px h-full bg-gaya-primary/50 transform -translate-x-1/2" />

          {roadmapItems.map((item, index) => (
            <motion.div
              key={`roadmap-${index}`}
              className={`relative mb-16 ${
                index % 2 === 0
                  ? "md:pr-8 md:ml-auto md:mr-[50%]"
                  : "md:pl-8 md:ml-[50%]"
              } md:w-[45%] z-10`}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              <div
                className={`absolute top-0 ${
                  index % 2 === 0 ? "right-0 md:-right-4" : "left-0 md:-left-4"
                } w-8 h-8 rounded-full bg-gaya-primary flex items-center justify-center text-white z-20`}
              >
                {index + 1}
              </div>

              <div className="bg-black/60 border border-gaya-primary/50 rounded-xl p-6">
                <h3 className="text-gaya-primary text-xl font-bold">
                  {item.phase}
                </h3>
                <h4 className="text-white text-lg font-semibold mb-4">
                  {item.title}
                </h4>

                <ul className="space-y-2">
                  {item.items.map((listItem, i) => (
                    <motion.li
                      key={`roadmap-item-${index}-${i}`}
                      className="flex items-start text-white/80"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.4 + index * 0.1 + i * 0.05,
                        duration: 0.4,
                      }}
                    >
                      <span className="text-gaya-accent mr-2">✓</span>
                      {listItem}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Componente de Comunidade
export const CommunitySection = () => {
  const socialLinks = [
    { name: "Twitter", icon: "twitter", url: "#", color: "bg-[#1DA1F2]" },
    { name: "Telegram", icon: "telegram", url: "#", color: "bg-[#0088cc]" },
    { name: "Discord", icon: "discord", url: "#", color: "bg-[#5865F2]" },
    {
      name: "Instagram",
      icon: "instagram",
      url: "#",
      color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    },
  ];

  return (
    <motion.section
      className="min-h-screen w-full flex items-center justify-center px-4 py-20 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-black/40 p-8 rounded-xl max-w-4xl w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gaya-accent mb-6 text-center"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Comunidade
        </motion.h2>

        <motion.p
          className="text-white text-center text-lg mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Junte-se à comunidade GAYA e faça parte desse movimento! <br />
          Compartilhe memes, participe de eventos e fique por dentro das
          novidades.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={`social-${index}`}
              href={social.url}
              className={`${social.color} rounded-xl p-6 text-white flex flex-col items-center justify-center min-h-[180px] hover:scale-105 transition-transform`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <div className="text-4xl mb-4">
                {social.icon === "twitter" && (
                  <Icons.social.twitter size={48} />
                )}
                {social.icon === "telegram" && (
                  <Icons.social.telegram size={48} />
                )}
                {social.icon === "discord" && (
                  <Icons.social.discord size={48} />
                )}
                {social.icon === "instagram" && (
                  <Icons.social.instagram size={48} />
                )}
              </div>
              <p className="font-bold text-xl">{social.name}</p>
              <span className="text-sm mt-2">@GAYA_coin</span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 p-6 border border-gaya-accent/30 rounded-xl bg-black/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gaya-accent mb-4 text-center">
            Newsletter
          </h3>
          <p className="text-white text-center mb-6">
            Receba atualizações e notícias exclusivas sobre GAYA diretamente no
            seu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex h-10 w-full rounded-md border border-gaya-primary/20 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gaya-primary focus:ring-offset-2 focus:ring-offset-black"
            />
            <Button className="h-10 bg-gaya-primary hover:bg-gaya-primary-dark whitespace-nowrap">
              Inscrever-se
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Componente FAQ
export const FAQSection = () => {
  const faqs = [
    {
      question: "O que significa GAYA?",
      answer:
        "GAYA é uma variação fonética de 'Gaia', que no contexto cultural de Recife refere-se à traição ou 'chifre'. A memecoin transforma esse elemento cultural em algo divertido e com potencial de valorização.",
    },
    {
      question: "Como posso comprar tokens GAYA?",
      answer:
        "Assim que o token for lançado, você poderá adquiri-lo através de exchanges descentralizadas como PancakeSwap. Detalhes específicos serão compartilhados em nossos canais oficiais.",
    },
    {
      question: "GAYA tem alguma utilidade além de ser uma memecoin?",
      answer:
        "Inicialmente, GAYA é focada em construir uma comunidade forte baseada na identificação cultural. No futuro, planejamos desenvolver utilidades como staking, governança através de DAO e parcerias com negócios locais em Recife.",
    },
    {
      question: "A equipe por trás do projeto é doxxed?",
      answer:
        "Sim, a equipe principal do projeto é doxxed, o que significa que nossas identidades são conhecidas e verificáveis, garantindo maior transparência e confiança para a comunidade.",
    },
    {
      question: "Existe um plano de marketing para GAYA?",
      answer:
        "Sim! Temos um plano de marketing extenso focado em parcerias com influenciadores locais, presença em eventos em Recife, campanhas virais nas redes sociais e estratégias de growth hacking.",
    },
  ];

  return (
    <motion.section
      className="min-h-screen w-full flex items-center justify-center px-4 py-20 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-black/40 p-8 rounded-xl max-w-3xl w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gaya-accent mb-10 text-center"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Perguntas Frequentes
        </motion.h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={`faq-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="border-gaya-primary/30"
              >
                <AccordionTrigger className="text-white text-lg hover:text-gaya-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
};

// Componente Footer
export const FooterSection = () => {
  return (
    <motion.footer
      className="w-full py-12 px-4 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-black/40 p-6 rounded-xl max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gaya-accent mb-4">GAYA</h3>
            <p className="text-white/80 mb-4">
              A memecoin do Recife para o mundo.
            </p>
            <p className="text-white/60 text-sm">
              © 2025 GAYA. Todos os direitos reservados.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  className="text-white/80 hover:text-gaya-primary transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-white/80 hover:text-gaya-primary transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#tokenomics"
                  className="text-white/80 hover:text-gaya-primary transition-colors"
                >
                  Tokenomics
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="text-white/80 hover:text-gaya-primary transition-colors"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/80 hover:text-gaya-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Disclaimer
            </h4>
            <p className="text-white/60 text-sm">
              GAYA é um projeto de memecoin para fins de entretenimento.
              Criptomoedas envolvem alto risco. Sempre faça sua própria pesquisa
              antes de investir. Não é um conselho financeiro.
            </p>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            Desenvolvido com 💙 em Recife, Pernambuco
          </p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-white/80 hover:text-gaya-primary transition-colors"
            >
              <Icons.social.twitter size={20} />
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-gaya-primary transition-colors"
            >
              <Icons.social.telegram size={20} />
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-gaya-primary transition-colors"
            >
              <Icons.social.discord size={20} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
