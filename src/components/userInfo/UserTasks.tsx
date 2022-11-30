import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store/store';
import { fetchTaskByUserId, selectTasks } from 'store/taskSlice';
import { Button, Card } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { fetchUserBoards, selectBoards } from 'store/boardsSlice';

type propsType = {
  userId: string | undefined;
};

type idAndTitle = {
  [key: string]: string;
};

export function UserTasks({ userId }: propsType) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const [boardList, setBoardList] = useState<idAndTitle[]>([]);

  const { entities, ids } = useSelector(selectTasks);
  const boards = useSelector(selectBoards);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTaskByUserId({ userId }));
      dispatch(fetchUserBoards({ userId }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const boardsArr: idAndTitle[] = [];
    const boardIds: string[] = [];

    ids.map((idTask) => {
      const boardId = entities[idTask]!.boardId;

      const boardTitle = boards.entities[boardId]?.title;

      if (boardIds.indexOf(boardId) === -1) {
        boardIds.push(boardId);
        boardsArr.push({ [entities[idTask]!.boardId]: boardTitle });
      }
    });
    setBoardList(boardsArr);
  }, [boards.entities, entities, ids]);

  return (
    <Card className="d-flex text-center" style={{ width: '100%' }}>
      <Card.Title className="mt-2">{t('user-page.tasks')}</Card.Title>
      {ids.length ? (
        <Card.Body>
          {boardList.map((idBoard) => (
            <div key={Object.keys(idBoard)[0]}>
              <div className="d-grid gap-2">
                <Button
                  className="btn-block mb-2"
                  onClick={() => navigate(`/boards/${Object.keys(idBoard)[0]}`)}
                >
                  {t('task-info.inBoard')} {Object.values(idBoard)}
                </Button>
              </div>
              <div className="d-flex justify-content-center">
                {ids.map(
                  (_id) =>
                    entities[_id]?.boardId === Object.keys(idBoard)[0] && (
                      <Card key={_id} className="shadow-sm mb-2" style={{ width: '15rem' }}>
                        <Card.Text className=" text-start mt-2 p-1">
                          {t('task-info.task')} {entities[_id]?.title}
                        </Card.Text>
                        <Card.Text className="text-start p-1">
                          {t('task-info.description')} {entities[_id]?.description}
                        </Card.Text>
                      </Card>
                    )
                )}
              </div>
            </div>
          ))}
        </Card.Body>
      ) : (
        <h5> {t('user-page.noTasks')}</h5>
      )}
    </Card>
  );
}
