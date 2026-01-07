import { Card, CardContent } from "@/components/ui/card";

export const VideosSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-8 uppercase tracking-wider text-muted-foreground">
          Vídeo Institucional
        </h2>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="aspect-video flex items-center justify-center bg-muted/30">
                <span className="text-lg font-medium text-muted-foreground uppercase tracking-wide">
                  Vídeo Institucional
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
