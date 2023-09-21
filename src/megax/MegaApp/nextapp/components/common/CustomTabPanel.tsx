'use client';

interface TabPanelProps {
  children?: React.ReactNode;
  curr: string;
  value: string;
}

export default function CustomTabPanel(props: TabPanelProps) {
  const { children, value, curr, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== curr}
      id={`user-tabpanel-${curr}`}
      aria-labelledby={`user-tab-${curr}`}
      {...other}
    >
      {value === curr && <>{children}</>}
    </div>
  );
}
