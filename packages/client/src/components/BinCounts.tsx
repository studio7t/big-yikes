import { useProjectStore } from '../stores/project.store';

export const BinCounts = () => {
  const bin = useProjectStore((state) => state.bin);

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
