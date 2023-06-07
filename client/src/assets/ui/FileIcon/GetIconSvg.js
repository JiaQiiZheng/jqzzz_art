import { data } from "./data";
import { format } from "./format";

const GetIconSvg = (ext) => {
  const index = format.indexOf(ext);
  const extSvg = data[index];
  return extSvg;
};

export default GetIconSvg;
