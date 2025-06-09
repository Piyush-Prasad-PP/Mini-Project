import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, BedDouble, Pill, Lightbulb } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl font-headline">
          Welcome to AI MeDciAssist
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
          Your intelligent partner for health guidance, bed availability, and medicine information.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="mt-20 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">Our Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Lightbulb className="h-10 w-10 text-accent" />}
            title="AI Symptom Checker"
            description="Get AI-powered suggestions for possible conditions based on your symptoms."
            link="/symptom-checker"
            linkText="Check Symptoms"
            dataAiHint="AI diagnosis"
          />
          <FeatureCard
            icon={<BedDouble className="h-10 w-10 text-accent" />}
            title="Bed Availability Tracker"
            description="Find live bed availability in hospitals near you. (Demo)"
            link="/bed-availability"
            linkText="Find Beds"
            dataAiHint="hospital bed"
          />
          <FeatureCard
            icon={<Pill className="h-10 w-10 text-accent" />}
            title="Medicine Availability"
            description="Locate nearby medical stores and check for medicine availability. (Demo)"
            link="/medicine-checker"
            linkText="Find Medicine"
            dataAiHint="pharmacy drugs"
          />
        </div>
      </section>

      <section className="mt-20 py-12 bg-card rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8">
          <div>
            <h2 className="text-3xl font-bold font-headline">Empowering Your Health Journey</h2>
            <p className="mt-4 text-muted-foreground">
              AI MeDciAssist is designed to provide you with accessible and reliable health information.
              Our tools aim to support your decisions and connect you with the resources you need.
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <span>Personalized insights</span>
              </li>
              <li className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                <span>Real-time information (simulated)</span>
              </li>
              <li className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <span>Easy access to medical resources</span>
              </li>
            </ul>
          </div>
          <div>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Healthcare professionals"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
              data-ai-hint="AI medical"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  dataAiHint: string;
}

function FeatureCard({ icon, title, description, link, linkText, dataAiHint }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center">
        <div className="p-4 bg-accent/10 rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription>{description}</CardDescription>
        <Image src={`https://placehold.co/300x200.png`} alt={title} width={300} height={200} className="my-4 rounded-md mx-auto" data-ai-hint={dataAiHint}/>
        <Button asChild className="mt-4">
          <Link href={link}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
