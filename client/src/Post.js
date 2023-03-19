import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Image from "./image";

const baseUrl = process.env.REACT_APP_API_URL;

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <Image src={cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt)).split(" ")[0]}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
