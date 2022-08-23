import { Bin } from '@big-yikes/lib';

export const BinCounts = ({ bin }: { bin: Bin }) => {
  return (
    <div>
      {Object.entries(bin).map(([slug, count]) => (
        <p key={slug}>
          {slug}: {count}
        </p>
      ))}
    </div>
  );
};
