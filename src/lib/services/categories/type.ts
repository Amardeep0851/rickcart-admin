export interface CategoryDataProps {
  id: string;
  name: string ;
  billboardId: string | null;
  billboardName?:string | undefined | null;
  status:boolean;
  createdAt:string;
}