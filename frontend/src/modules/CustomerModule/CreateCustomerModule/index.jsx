import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import CustomerForm from '@/modules/CustomerModule/Forms/CustomerForm';

export default function CreateQuoteModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={CustomerForm} />
    </ErpLayout>
  );
}
