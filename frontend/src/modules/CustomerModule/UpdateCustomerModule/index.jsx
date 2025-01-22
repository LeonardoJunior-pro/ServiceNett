import NotFound from '@/components/NotFound';

import { ErpLayout } from '@/layout';
import CustomerUpdateItem from '@/modules/ErpPanelModule/CustomerUpdateItem';
import CustomerForm from '@/modules/CustomerModule/Forms/CustomerForm';

import PageLoader from '@/components/PageLoader';

import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateCustomerModule({ config }) {
  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  useLayoutEffect(() => {
    if (currentResult) {
      dispatch(erp.currentAction({ actionType: 'update', data: currentResult }));
    }
  }, [currentResult]);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  } else
    return (
      <ErpLayout>
        {isSuccess ? (
          <CustomerUpdateItem config={config} UpdateForm={CustomerForm} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
