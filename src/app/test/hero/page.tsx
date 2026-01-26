import GradientHeroSection from '@/templates/GradientHeroSection/GradientHeroSection';

export default function Page() {
  return (
    <>
      <GradientHeroSection
        gradientFrom="primary"
        gradientTo="light"
        textColour="text-white"
        title="Visual Test Hero"
        subtitle="Snapshot baseline"
      />
    </>
  );
}
