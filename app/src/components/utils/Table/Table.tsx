import styles from "./Table.module.css";
import { formatDateToDDMMYYYY } from "../../../utils/transformDate";
import { Link } from "react-router-dom";

const Table = (props: any) => {
  const fields = props.fields;
  const actions = props.actions;
  const fieldsToInclude = props.fieldsToInclude;
  const linkFields = props.linkFields;
  const specialWidth = props.specialWidth;

  const addClass = props.addClass;

  const openExternal = (e: any, path: string, external: boolean) => {
    if (external) {
      e.preventDefault();
      window.open(path, "_blank", "noopener,noreferrer");
    }
  };

  const applyClass = (field: any) => {
    let className = "";

    if (field === "description") {
      const widthClass = `special-${specialWidth}`;
      className = specialWidth ? `${styles[widthClass]}` : `${styles.special}`;
      return className;
    }

    if (
      field === "type" ||
      field === "level" ||
      (specialWidth === 20 && field === "title")
    ) {
      const widthClass = `special-10`;
      className = `${styles[widthClass]}`;
      return className;
    }

    if (field === "input" || field === "expected") {
      const widthClass = `special-20`;
      className = `${styles[widthClass]}`;
      return className;
    }

    if (field === "name") {
      className = `${styles.width}`;
      return className;
    }

    return className;
  };

  return (
    <table className={`${styles.table} ${addClass && styles.width}`}>
      <thead>
        <tr>
          {fieldsToInclude.map((field: any, i: number) => (
            <th key={`${field}-${i}`}>{field}</th>
          ))}
          {Object.keys(actions).map((action: any, i: number) => (
            <th key={`${action}-${i}`} className={styles.action}>
              Action
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.length > 0 &&
          fields.map((field: any) => {
            return (
              <tr key={field._id}>
                {Object.keys(field).map((prop: any) => {
                  if (fieldsToInclude.includes(prop)) {
                    const item = linkFields?.find(
                      (item: any) => item.field === prop
                    );
                    if (item) {
                      const id =
                        item.field === "course" ? field.course : field._id;
                      return (
                        <td key={prop} className={applyClass(prop)}>
                          <Link
                            to={item.path(id, field.downloadURL)}
                            onClick={(e) => {
                              openExternal(
                                e,
                                item.path(id, field.downloadURL),
                                item.external
                              );
                            }}
                          >
                            {prop === "createdAt"
                              ? formatDateToDDMMYYYY(field[prop])
                              : prop === "courses"
                              ? field[prop].length
                              : field[prop]}
                          </Link>
                        </td>
                      );
                    }
                    return (
                      <td key={prop} className={applyClass(prop)}>
                        {prop === "createdAt"
                          ? formatDateToDDMMYYYY(field[prop])
                          : prop === "courses"
                          ? field[prop].length
                          : field[prop]}
                      </td>
                    );
                  }
                })}
                {Object.keys(actions).map((action: any) => {
                  return (
                    <td key={action}>
                      <button
                        onClick={() => {
                          actions[action](field._id);
                        }}
                      >
                        {action}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;
