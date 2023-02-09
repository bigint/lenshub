import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Spinner } from '@components/UI/Spinner';
import { TextArea } from '@components/UI/TextArea';
import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { Publication } from 'lens';
import { useReportPublicationMutation } from 'lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PAGEVIEW, PUBLICATION } from 'src/tracking';
import { Button, EmptyState } from 'web-ui';
import { object, string } from 'zod';

import Reason from './Reason';

const newReportSchema = object({
  additionalComments: string().max(260, {
    message: t`Additional comments should not exceed 260 characters`
  })
});

interface Props {
  publication: Publication;
}

const Report: FC<Props> = ({ publication }) => {
  const reportConfig = useGlobalModalStateStore((state) => state.reportConfig);
  const [type, setType] = useState(reportConfig?.type ?? '');
  const [subReason, setSubReason] = useState(reportConfig?.subReason ?? '');

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'report' });
  }, []);

  const [createReport, { data: submitData, loading: submitLoading, error: submitError }] =
    useReportPublicationMutation({
      onCompleted: () => {
        Leafwatch.track(PUBLICATION.REPORT);
      }
    });

  const form = useZodForm({
    schema: newReportSchema
  });

  const reportPublication = (additionalComments: string | null) => {
    createReport({
      variables: {
        request: {
          publicationId: publication?.id,
          reason: {
            [type]: {
              reason: type.replace('Reason', '').toUpperCase(),
              subreason: subReason
            }
          },
          additionalComments
        }
      }
    });
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {submitData?.reportPublication === null ? (
        <EmptyState
          message={t`Publication reported successfully!`}
          icon={<CheckCircleIcon className="h-14 w-14 text-green-500" />}
          hideCard
        />
      ) : publication ? (
        <div className="p-5">
          <Form
            form={form}
            className="space-y-4"
            onSubmit={({ additionalComments }) => {
              reportPublication(additionalComments);
            }}
          >
            {submitError && <ErrorMessage title={t`Failed to report`} error={submitError} />}
            <Reason setType={setType} setSubReason={setSubReason} type={type} subReason={subReason} />
            {subReason && (
              <>
                <TextArea
                  label={t`Description`}
                  placeholder={t`Please provide additional details`}
                  {...form.register('additionalComments')}
                />
                <div className="ml-auto">
                  <Button
                    type="submit"
                    disabled={submitLoading}
                    icon={submitLoading ? <Spinner size="xs" /> : <PencilAltIcon className="h-4 w-4" />}
                  >
                    <Trans>Report</Trans>
                  </Button>
                </div>
              </>
            )}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default Report;
