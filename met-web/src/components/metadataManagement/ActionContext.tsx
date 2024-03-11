import React, { createContext, useState, useEffect } from 'react';
import { ActionContextProps } from './types';
import { MetadataTaxon, MetadataTaxonModify } from 'models/engagement';
import {
    getMetadataTaxa,
    patchMetadataTaxaOrder,
    patchMetadataTaxon,
    postMetadataTaxon,
    deleteMetadataTaxon,
} from 'services/engagementMetadataService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';

export const ActionContext = createContext<ActionContextProps>({
    metadataTaxa: [],
    selectedTaxon: null,
    isLoading: true,
    setSelectedTaxonId: () => {
        throw new Error('setSelectedTaxonId called without a provider');
    },
    reorderMetadataTaxa: () => {
        return [];
    },
    createMetadataTaxon: () => {
        throw new Error('createMetadataTaxon called without a provider');
    },
    updateMetadataTaxon: () => {
        throw new Error('updateMetadataTaxon called without a provider');
    },
    removeMetadataTaxon: () => {
        throw new Error('removeMetadataTaxon called without a provider');
    },
});

const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const dispatch = useAppDispatch();
    const [metadataTaxa, setMetadataTaxa] = useState<MetadataTaxon[]>([]);
    const [selectedTaxonId, setSelectedTaxonId] = useState<number>(-1);

    const selectedTaxon = metadataTaxa.find((taxon) => taxon.id === selectedTaxonId) || null;

    const fetchMetadataTaxa = async () => {
        try {
            setMetadataTaxa(await getMetadataTaxa());
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error while retrieving data.' }));
        }
    };

    const createMetadataTaxon = async (taxonData: MetadataTaxonModify) => {
        try {
            const taxon = await postMetadataTaxon(taxonData);
            setMetadataTaxa((prev) => [...prev, taxon]);
            return taxon;
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error while creating taxon.' }));
            return null;
        }
    };

    const updateMetadataTaxon = async (taxonData: MetadataTaxon) => {
        try {
            const taxon = await patchMetadataTaxon(taxonData.id, taxonData);
            setMetadataTaxa((prev) => {
                const index = prev.findIndex((t) => t.id === taxon.id);
                prev[index] = taxon;
                return [...prev];
            });
            return taxon;
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error while saving taxon.' }));
            return null;
        }
    };

    const removeMetadataTaxon = async (taxonId: number) => {
        try {
            if (selectedTaxon && selectedTaxon.id === taxonId) {
                const nextTaxon = metadataTaxa.find(
                    (taxon) =>
                        taxon.position === selectedTaxon.position + 1 || taxon.position === selectedTaxon.position - 1,
                );
                setSelectedTaxonId(nextTaxon?.id || -1);
            }
            setMetadataTaxa((prev) => prev.filter((taxon) => taxon.id !== taxonId));
            await deleteMetadataTaxon(taxonId);
            setMetadataTaxa(await getMetadataTaxa());
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error while deleting taxon.' }));
        }
    };

    const reorderMetadataTaxa = async (taxonIds: number[]) => {
        try {
            // Client side reorder to prevent flicker
            const orderedTaxa = taxonIds.map((id) => metadataTaxa.find((taxon) => taxon.id === id));
            setMetadataTaxa(orderedTaxa.filter((taxon) => taxon !== undefined) as MetadataTaxon[]);
            // Send to API
            setMetadataTaxa(await patchMetadataTaxaOrder(taxonIds));
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error while reordering taxa.' }));
        }
    };

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            await fetchMetadataTaxa();
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <ActionContext.Provider
            value={{
                metadataTaxa,
                selectedTaxon,
                setSelectedTaxonId,
                reorderMetadataTaxa,
                createMetadataTaxon,
                updateMetadataTaxon,
                removeMetadataTaxon,
                isLoading,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

export default ActionProvider;
