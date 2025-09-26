export interface CategoryDataProps {
  id: string;
  name: string ;
  icon:string;
  billboardId: string | null;
  billboardName?:string | undefined | null;
  status:boolean;
  createdAt:string;
}