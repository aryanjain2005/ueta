import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Phone } from "lucide-react";
import type { Product } from "types";

export function DDListDialog({
  dealers,
  distributors,
  children,
}: {
  dealers: Product["dealers"];
  distributors: Product["distributors"];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle>Dealers of Sony - Televisions</DialogTitle>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                24
              </span>
            </div>
            <div className="space-y-4">
              {dealers.map((dealer, index) => {
                const contactInfo =
                  dealer.contact &&
                  dealer.contact.find((c) => c.type === "phone")?.value;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={dealer.images} alt={dealer.name} />
                        <AvatarFallback>DN</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{dealer.name}</span>
                    </div>
                    {contactInfo && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Phone className="h-4 w-4" />
                        {contactInfo}
                      </p>
                    )}
                  </div>
                );
              })}
              <Button variant="link" className="px-0">
                More Dealers
              </Button>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle>Distributors of Sony - Televisions</DialogTitle>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                24
              </span>
            </div>
            <div className="space-y-4">
              {distributors.map((distributor, index) => {
                const contactInfo =
                  distributor.contact &&
                  distributor.contact.find((c) => c.type === "phone")?.value;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={distributor.images}
                          alt={distributor.name}
                        />
                        <AvatarFallback>DN</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{distributor.name}</span>
                    </div>
                    {contactInfo && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Phone className="h-4 w-4" />
                        {contactInfo}
                      </p>
                    )}
                  </div>
                );
              })}
              <Button variant="link" className="px-0">
                More Distributors
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
