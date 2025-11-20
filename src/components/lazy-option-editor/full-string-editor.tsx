// import { Button, Input, Popconfirm } from "antd";
// import { useEffect, useState } from "react";
// import style from "./style.module.css";

// interface Props {
//   option: string;
//   onSave: (opt: string) => void;
//   onDelete?: () => void;
// }

// export default function StringOptionEditor(props: Props) {
//   const { option: inputOption, onDelete, onSave } = props;
//   const [option, setOption] = useState<string>("");

//   useEffect(() => {
//     setOption(inputOption);
//   }, [inputOption]);

//   return (
//     <div className={style.container}>
//       <div>
//         <label>{inputOption}</label>
//       </div>
//       <div>
//         <Input
//           value={option}
//           onChange={(e) => setOption(e.target.value)}
//           style={{ width: "auto" }}
//         />

//         <Button type="primary" onClick={() => onSave(option)}>
//           Save
//         </Button>
//         {onDelete && (
//           <Popconfirm
//             title="Confirm Deletion"
//             description={`Are you sure to delete the option ${option}?`}
//             onConfirm={() => onDelete()} // do not await
//             // onCancel={cancel}
//             okText="Delete"
//             cancelText="Cancel"
//           >
//             <Button type="primary" danger>
//               Delete
//             </Button>
//           </Popconfirm>
//         )}
//       </div>
//     </div>
//   );
// }
