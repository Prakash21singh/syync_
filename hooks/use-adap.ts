import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import type { AdapterRole, AdapterStatus, AdapterType, AWSCredentials, ExistingAdapter } from '@/types/index';
import { getGoogleOAuthURL } from '@/utils/functions/google-connect';
import { getDropboxAuthUrl } from '@/utils/functions/dropbox-connect';
import { getAWSUserInfo } from '@/lib/s3';

// Map adapter display name → API enum
const ADAPTER_TYPE_MAP: Record<string, AdapterType> = {
  'Google Drive': 'GOOGLE_DRIVE',
  Dropbox: 'DROPBOX',
  'Amazon S3': "AWS_S3"
};

// Map adapter display name → OAuth redirect
const ADAPTER_AUTH_MAP: Record<string, () => string> = {
  'Google Drive': getGoogleOAuthURL,
  Dropbox: getDropboxAuthUrl,
};

export interface UseAdapterReturn {
  // State
  role: AdapterRole;
  selectedAdapter: string;
  existingAdapters: ExistingAdapter[];
  selectedExistingId: string;
  status: AdapterStatus;
  open: boolean;
  extAdapOpen: boolean;

  // Derived
  selectedExisting: ExistingAdapter | null;
  isS3CredentialRequired:boolean;
  isLoading:boolean;
  error: string | null;
  awsUser: null | {
    username: string;
    arn:string;
    userId:string
  }
  // Setters
  setOpen: (v: boolean) => void;
  setExtAdapOpen: (v: boolean) => void;
  setSelectedExistingId: (id: string) => void;
  reset: () => void;

  // Actions
  selectAdapter: (adapterName: string) => Promise<void>;
  addAccount: () => void;
  setIsS3CredentialRequired: Dispatch<SetStateAction<boolean>>
  validateAWSCredentials: ({accessKeyId, secretAccessKey, region} : AWSCredentials) => void
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | null>>
}

export function useAdapter(role: AdapterRole): UseAdapterReturn {
  const [selectedAdapter, setSelectedAdapter] = useState('');
  const [existingAdapters, setExistingAdapters] = useState<ExistingAdapter[]>([]);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  const [status, setStatus] = useState<AdapterStatus>('idle');
  const [open, setOpen] = useState(false);
  const [extAdapOpen, setExtAdapOpen] = useState(false);
  const [isS3CredentialRequired, setIsS3CredentialRequired] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null)
  const [awsUser, setAWSUser] = useState<null | {
    username:string;
    arn:string;
    userId:string;
  } >(null)

  // Auto-select first adapter when list loads
  useEffect(() => {
    if (existingAdapters.length > 0 && !selectedExistingId) {
      setSelectedExistingId(existingAdapters[0].id);
    }
  }, [existingAdapters, selectedExistingId]);

  // Validate token whenever selected account changes
  useEffect(() => {
    if (!selectedExistingId) return;
    if(selectedAdapter === "Amazon S3") {
      setStatus("idle")
      return
    }
    validateAdapter(selectedExistingId);
  }, [selectedExistingId]);

  const validateAdapter = useCallback(async (adapterId: string) => {
    setStatus('validating');
    try {
      const res = await fetch('/api/adapter/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ adapterId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        return;
      }

      // API returns: "valid" | "rotated" | "reauth"
      if (data.status === 'reauth') {
        setStatus('requires_reauth');
      } else {
        // "valid" or "rotated" — both treated as valid
        setStatus('valid');
      }
    } catch {
      setStatus('error');
    }
  }, []);

  const fetchExistingAdapters = useCallback(
    async (adapterName: string): Promise<ExistingAdapter[]> => {
      const adapterType = ADAPTER_TYPE_MAP[adapterName];
      if (!adapterType) return [];

      const res = await fetch(`/api/adapter/exists?adapterType=${adapterType}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();
      return data.exists ?? [];
    },
    [],
  );

  const validateAWSCredentials = useCallback(
    async ({
      accessKeyId,
      secretAccessKey,
      region
    }:AWSCredentials) => {
        setIsLoading(true)
        setError(null)

        const res = await getAWSUserInfo({
          accessKeyId, 
          secretAccessKey,
          region
        })

        if(res.success){
          setAWSUser(res.data)
        }else{
          setError(res.error)
        }
        
        setIsLoading(false);
    },[]
  )

  const selectAdapter = useCallback(
    async (adapterName: string) => {
      // Toggle off
      if (adapterName === selectedAdapter) {
        reset();
        return;
      }

      setSelectedAdapter(adapterName);
      setExistingAdapters([]);
      setSelectedExistingId('');
      setStatus('idle');
      setOpen(false);
      setIsS3CredentialRequired(false)

      const adapters = await fetchExistingAdapters(adapterName);

      console.log(adapters)

      if (adapters.length === 0) {
        if(adapterName === "Amazon S3"){
          setIsS3CredentialRequired(true);
        }else{
          // Handing dropbox or google drive.
          const authUrl = ADAPTER_AUTH_MAP[adapterName]?.();
          if (authUrl) window.location.href = authUrl;
          return;
        }
      }

      setExistingAdapters(adapters);
    },
    [selectedAdapter, fetchExistingAdapters],
  );

  const addAccount = useCallback(() => {
    const authUrl = ADAPTER_AUTH_MAP[selectedAdapter]?.();
    if (authUrl) window.location.href = authUrl;
  }, [selectedAdapter]);

  const reset = useCallback(() => {
    setSelectedAdapter('');
    setExistingAdapters([]);
    setSelectedExistingId('');
    setStatus('idle');
    setOpen(false);
    setExtAdapOpen(false);
    setIsS3CredentialRequired(false)
    setAWSUser(null)
    setIsLoading(false)
    setError(null)
  }, []);

  const selectedExisting =
    existingAdapters.find((a) => a.id === selectedExistingId) ?? existingAdapters[0] ?? null;
  

  return {
    role,
    selectedAdapter,
    existingAdapters,
    selectedExistingId,
    status,
    open,
    extAdapOpen,
    selectedExisting,
    isS3CredentialRequired,
    error,
    isLoading,
    awsUser,
    setError,
    setIsLoading,
    setOpen,
    setExtAdapOpen,
    setSelectedExistingId,
    reset,
    selectAdapter,
    addAccount,
    setIsS3CredentialRequired,
    validateAWSCredentials
  };
}
