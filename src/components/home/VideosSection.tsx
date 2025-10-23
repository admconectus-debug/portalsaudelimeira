import { Card, CardContent } from "@/components/ui/card";

export const VideosSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white border-2 rounded-2xl overflow-hidden" style={{ borderColor: '#B7E23A' }}>
            <CardContent className="p-0">
              <div className="aspect-video flex items-center justify-center">
                <span className="text-2xl font-semibold" style={{ color: '#DC2626' }}>
                  VÍDEO
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 rounded-2xl overflow-hidden" style={{ borderColor: '#B7E23A' }}>
            <CardContent className="p-0">
              <div className="aspect-video flex items-center justify-center">
                <span className="text-2xl font-semibold" style={{ color: '#DC2626' }}>
                  VÍDEO
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
