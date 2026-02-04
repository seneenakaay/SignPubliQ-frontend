import RecipientsClient from './RecipientsClient';

export const metadata = {
  title: 'Add Recipients - SignPubliQ',
  description: 'Add recipients and assign roles for the envelope',
};

export default function RecipientsPage() {
  return <RecipientsClient />;
}
