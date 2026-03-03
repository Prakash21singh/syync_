import { useState } from 'react';

export const useSetupAdapter = () => {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceExtAdapOpen, setSourceExtAdapOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [destExtAdapOpen, setDestExtAdapOpen] = useState(false);

  return {
    sourceOpen,
    sourceExtAdapOpen,
    destOpen,
    destExtAdapOpen,
    setSourceOpen,
    setSourceExtAdapOpen,
    setDestOpen,
    setDestExtAdapOpen,
  };
};

interface ExistingAdapterInterface {
  id: string;
  adapter_type: 'GOOGLE_DRIVE' | 'DROPBOX';
  name: string;
  adapterAccountInfo: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

export const useSelectAdapter = () => {
  const [sourceAdapter, setSourceAdapter] = useState<string>('');
  const [destinationAdapter, setDestinationAdapter] = useState<string>('');
  const [destExistingAdapters, setDestExistingAdapters] = useState<ExistingAdapterInterface[]>([]);
  const [sourceExistingAdapters, setSourceExistingAdapters] = useState<ExistingAdapterInterface[]>(
    [],
  );

  return {
    sourceAdapter,
    destinationAdapter,
    destExistingAdapters,
    sourceExistingAdapters,
    setSourceAdapter,
    setDestinationAdapter,
    setDestExistingAdapters,
    setSourceExistingAdapters,
  };
};

interface GoogleDriveFiles {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
  webViewLink: string;
  iconLink: string;
  hasThumbnail: boolean;
  thumbailLink?: string;
  size: number;
}

export const useSyyncAdapter = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [selectedDestExistingId, setSelectedDestExistingId] = useState<string>('');
  const [selectedSourceExistingId, setSelectedSourceExistingId] = useState<string>('');
  const [entitiesToMigrate, setEntitiesToMigrate] = useState<GoogleDriveFiles[]>([]);
  const [entityView, setEntityView] = useState<'list' | 'grid'>('list');
  const [selectedEntity, setSelectedEntity] = useState<GoogleDriveFiles[] | any[]>([]);

  const handleEntitySelect = (entity: GoogleDriveFiles) => {
    if (selectedEntity.includes(entity)) {
      setSelectedEntity((prev) => prev.filter((e) => e !== entity));
    } else {
      setSelectedEntity((prev) => [...prev, entity]);
    }
  };

  const isSelected = (id: string) => {
    return selectedEntity.some((e) => e.id === id);
  };

  return {
    showLogin,
    isMigrating,
    selectedSourceExistingId,
    selectedDestExistingId,
    entitiesToMigrate,
    entityView,
    selectedEntity,
    setShowLogin,
    setIsMigrating,
    setSelectedDestExistingId,
    setSelectedSourceExistingId,
    setEntitiesToMigrate,
    setEntityView,
    setSelectedEntity,
    handleEntitySelect,
    isSelected,
  };
};

export const useAdapter = (type: 'SOURCE' | 'DESTINATION') => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAdapter, setSelectedAdapter] = useState();
  const [selectedAdapterType, setSelectedAdapterType] = useState();
  const [adapterOpen, setAdapterOpen] = useState();
  const [adapterProfileOpen, setAdapterProfileOpen] = useState();
  const [adapterList, setAdapterList] = useState();

  // Auth Guard
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [showLogin, setShowLogin] = useState(false);

  const handleAdapterSelect = async (adapterName: string) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    await handleAdapterIntegration(adapterName);
  };

  async function handleAdapterIntegration(adapterName: string) {}

  return {
    loading,
    adapterOpen,
    adapterList,
    selectedAdapter,
    adapterProfileOpen,
    setLoading,
    setAdapterOpen,
    setAdapterList,
    setSelectedAdapter,
    setAdapterProfileOpen,
  };
};
