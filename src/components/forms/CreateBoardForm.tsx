import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from 'store/authSlice';
import { createBoard } from 'store/boardsSlice';
import { AppDispatch } from 'store/store';

export function CreateBoardForm({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector(selectAuth);
  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  function submitHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    dispatch(createBoard({ owner: authState.auth._id ?? '', title, users: [] }));
    onClose();
  }

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="createBoardFormTitle">
        <Form.Label>{t('board.board title')}</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter board title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="createBoardFormDesc">
        <Form.Label>{t('board.board description')}</Form.Label>
        <Form.Control type="text" placeholder="Enter board description" />
      </Form.Group>
      <Modal.Footer>
        <Button variant="secondary" type="reset" onClick={onClose}>
          {t('close')}
        </Button>
        <Button variant="primary" type="submit">
          {t('board.create board button')}
        </Button>
      </Modal.Footer>
    </Form>
  );
}