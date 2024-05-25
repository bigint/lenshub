import dotenv from 'dotenv';
import cron from 'node-cron';

import cleanClickhouse from './cleanClickhouse';
import cleanDraftPublications from './cleanDraftPublications';
import cleanEmailTokens from './cleanEmailTokens';
import cleanPreferences from './cleanPreferences';
import deletePublications from './deletePublications';
import replicateGardeners from './replicateGardeners';
import replicatePublications from './replicatePublications';

dotenv.config({ override: true });

cron.schedule('*/5 * * * *', async () => {
  await replicateGardeners();
});

cron.schedule('*/10 * * * * *', async () => {
  await replicatePublications();
  await deletePublications();
});

cron.schedule('*/20 * * * * *', async () => {
  await cleanClickhouse();
  await cleanDraftPublications();
  await cleanEmailTokens();
  await cleanPreferences();
});
