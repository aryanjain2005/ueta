import PBItem from "@components/cards/pb-item";
import { ShowMore } from "@components/showmore";
import { useState } from "react";
import { DDListDialog } from "./dialog-list";
import type { Brand, Product } from "types";

type Props = {
  size?: "normal" | "small";
  type: "product" | "brand";
  className?: string;
  useDialog?: boolean;
} & (
  | { type: "product"; list: Brand["products"] }
  | { type: "brand"; list: Product["brands"] }
);

const PBList = ({
  className,
  list,
  type,
  size = "normal",
  useDialog = false,
}: Props) => {
  const [previewList, setPreviewList] = useState<typeof list>(
    list.slice(0, 10)
  );

  const renderPBItem = (pb: any) => {
    if (useDialog) {
      return (
        <DDListDialog dealers={pb.dealers} distributors={pb.distributors}>
          <PBItem link={false} size={size} pb={pb} type={type} />
        </DDListDialog>
      );
    }
    return <PBItem key={pb.slug} pb={pb} size={size} type={type} />;
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <h3 className="text-4xl font-bold uppercase mb-10 font-gr ">{`Shop by ${
        type === "product" ? "Product" : "Brand"
      }`}</h3>
      <div className="flex flex-wrap gap-8 md:gap-14 place-content-center">
        {previewList.length > 0 && previewList.map(renderPBItem)}
      </div>
      {list.length > 10 && (
        <ShowMore
          onClick={(isShow: boolean) => {
            if (isShow) setPreviewList(list.slice(0, 10));
            else setPreviewList(list);
          }}
          className="flex items-center gap-2 text-[#003DA6] font-medium px-3 py-1.5 "
        />
      )}
    </div>
  );
};

export default PBList;
