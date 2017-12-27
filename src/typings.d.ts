/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}


interface WorkingLine{
  content: string;
  style: string;
  tabs: number;
  tabLevels: number[];
}

// export enum HeaderStyle { HEADER1:"header1", HEADER2:"header1", HEADER3:"header1", HEADER4:"header1", NORMAL:"header1"}
