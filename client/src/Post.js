import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Image from "./image";

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
  section,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/${section}/post/${_id}`}>
          <Image src={cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/${section}/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href={`/${section}/post/${_id}`} className="author">
            {author.username}
          </a>
          <time>{formatISO9075(new Date(createdAt)).split(" ")[0]}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
