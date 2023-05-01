import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { YjsClient } from '../service/yjs-client';
import { customAlphabet } from 'nanoid';
import { TodoAwareness, TodoItem } from '../type';
import { IconCursor } from '../icon-cursor';

export const RoomView: FC<IProps> = () => {
  const params = useParams();

  const [awareness, setAwareness] = useState<TodoAwareness>(new Map());
  const [todoText, setTodoText] = useState('');
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  const yjsClientRef = useRef<YjsClient | null>(null);

  useEffect(() => {
    // 创建一个房间
    const roomId = params.roomId;
    if (!roomId) {
      alert('没有房间号！');
      return;
    }

    const username =
      localStorage.getItem('yjs-react-todo-app-username') ||
      customAlphabet('abcdefghijklmn', 6)();

    // 连接 ws
    const yjsClient = new YjsClient(roomId, username);
    (window as any).yjsClient = yjsClient; // 方便 debug
    yjsClientRef.current = yjsClient;

    // 监听 todoItems 数据的变化
    yjsClient.onTodoItemsChange((event) => {
      setTodoItems(event.target.toArray());
    });

    // 监听光标位置变化，同步到 awareness
    const handleMousemove = (e: MouseEvent) => {
      yjsClientRef.current?.updateCursor(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMousemove);
    // 跑到页面外的时候，清空光标位置
    const handleMouseout = () => {
      yjsClientRef.current?.updateCursor(undefined, undefined);
    };
    window.addEventListener('mouseout', handleMouseout);

    // 监听 awareness 的变化
    yjsClient.onAwarenessChange((state) => {
      setAwareness(new Map([...state]));
    });

    return () => {
      yjsClient.destroy();
      yjsClientRef.current = null;
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('mouseout', handleMouseout);
    };
  }, [params.roomId]);

  const addTodo = () => {
    if (!todoText) {
      return;
    }

    yjsClientRef.current?.addTodoItem(todoText);
  };

  const deleteTodo = (index: number) => {
    yjsClientRef.current?.deleteTodoItem(index);
  };

  const toggleTodoItemDone = (index: number) => {
    yjsClientRef.current?.toggleTodoItemDone(index);
  };

  const undo = () => {
    yjsClientRef.current?.undo();
  };
  const redo = () => {
    yjsClientRef.current?.redo();
  };

  const deleteAll = () => {
    yjsClientRef.current?.deleteAllTodoItems();
  };

  return (
    <div>
      <div>房间号：{params.roomId}</div>
      <div>
        <button onClick={undo}>撤销</button>
        <button onClick={redo}>重做</button>
        <button onClick={deleteAll}>清空所有</button>
      </div>

      <div>
        <input
          value={todoText}
          placeholder="新建待办"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setTodoText(target.value);
          }}
        ></input>
        <button
          onClick={() => {
            addTodo();
            setTodoText('');
          }}
        >
          添加
        </button>
      </div>

      <div>
        {todoItems.map((item, index) => {
          return (
            <div key={item.id}>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => {
                  toggleTodoItemDone(index);
                }}
              ></input>
              <span
                style={{
                  textDecoration: item.done ? 'line-through' : undefined,
                }}
              >
                {item.text}
              </span>
              <button
                style={{ marginLeft: 16 }}
                onClick={() => deleteTodo(index)}
              >
                删除
              </button>
            </div>
          );
        })}
      </div>

      {/* 光标 */}
      {Array.from(awareness)
        .filter(([id]) => {
          return id !== yjsClientRef.current?.ydoc.clientID;
        }) // 过滤掉自己
        .filter(([, state]) => {
          return state.cursor.x !== undefined;
        }) // 过滤跑出网页的用户
        .map(([id, state]) => {
          return (
            <div
              key={id}
              style={{
                position: 'fixed',
                left: state.cursor.x,
                top: state.cursor.y,
                color: state.user.color,
                pointerEvents: 'none',
              }}
            >
              <IconCursor />
              {state.user.name}
            </div>
          );
        })}
    </div>
  );
};
