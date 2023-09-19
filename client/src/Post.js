import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Image from "./image";
import { UserContext } from "./UserContext";
import { useContext } from "react";

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

  const{setUserInfo, userInfo} = useContext(UserContext);

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
        {section === "computation" && (
          <p className="info">
            <Link to={`/${section}/post/${_id}`} className="author">
              {author.email? author.email.split("@")[0] : author.username}
            </Link>
            <time>{formatISO9075(new Date(createdAt)).split(" ")[0]}</time>
          </p>
        )}
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
