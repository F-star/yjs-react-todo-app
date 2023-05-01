import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customAlphabet } from 'nanoid';

export const JoinRoomView: FC = () => {
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('yjs-react-todo-app-username', username);
    const id = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 18)();
    navigate(`/room/${id}`);
  };

  return (
    <div>
      <div>
        用户名：
        <input
          value={username}
          onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
        ></input>
      </div>
      <button disabled={!username} onClick={handleClick}>
        创建新房间
      </button>
    </div>
  );
};
