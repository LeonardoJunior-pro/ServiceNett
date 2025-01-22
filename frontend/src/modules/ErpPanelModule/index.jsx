import { useLayoutEffect } from 'react';

import EmailDataTable from './EmailDataTable';

import Delete from './DeleteItem';

import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';

export default function ErpPanel({ config, extra }) {
  const dispatch = useDispatch();
  const { state } = useErpContext();
  const { deleteModal } = state;

  const dispatcher = () => {
    dispatch(erp.resetState());
  };

  useLayoutEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <EmailDataTable config={config} extra={extra} />
      <Delete config={config} isOpen={deleteModal.isOpen} />
    </>
  );
}
