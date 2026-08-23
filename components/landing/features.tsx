import { FeatureCard } from "@/components/landing/feature-card";
import { Section } from "@/components/layout/section";
import { features } from "@/data/features";

export function Features() {
  return (
    <Section id="features" title="Recursos">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            highlighted={feature.highlighted}
            badgeText={feature.badgeText}
          />
        ))}
      </div>
    </Section>
  );
}
