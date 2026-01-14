import { Copy, Key, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import api from '../services/api';
import { useStore } from '../store/useStore';

interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  isActive: boolean;
  createdAt: string;
}

export const SettingsPage: React.FC = () => {
  const selectedProject = useStore((state) => state.selectedProject);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProject) {
      loadApiKeys();
    }
  }, [selectedProject]);

  const loadApiKeys = async () => {
    if (!selectedProject) return;
    try {
      const response = await api.get(`/keys/project/${selectedProject.id}`);
      setApiKeys(response.data.data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleCreateKey = async () => {
    if (!selectedProject || !newKeyName.trim()) return;

    try {
      const response = await api.post('/keys', {
        projectId: selectedProject.id,
        name: newKeyName,
      });
      
      setNewlyCreatedKey(response.data.data.key);
      await loadApiKeys();
      setNewKeyName('');
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta API key?')) return;

    try {
      await api.delete(`/keys/${id}`);
      await loadApiKeys();
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Selecione um projeto para gerenciar as configurações</p>
        <a href="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Voltar para projetos
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie as API keys do projeto {selectedProject.name}</p>
      </div>

      <Card
        title="API Keys"
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova API Key
          </button>
        }
      >
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma API key criada ainda
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{key.name}</p>
                    <p className="text-sm text-gray-600 font-mono">{key.keyPreview}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Criada em {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteKey(key.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Criar Nova API Key</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Key *
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Production API Key"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewlyCreatedKey(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newly Created Key Modal */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-green-600">API Key Criada!</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Copie esta key agora. Ela não será exibida novamente!
              </p>
            </div>
            <div className="relative">
              <code className="block p-3 bg-gray-100 rounded-md text-sm break-all font-mono">
                {newlyCreatedKey}
              </code>
              <button
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="absolute top-2 right-2 p-2 bg-white rounded-md hover:bg-gray-50 border border-gray-300"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setNewlyCreatedKey(null);
                setShowCreateModal(false);
              }}
              className="w-full mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Entendi, fechar
            </button>
          </div>
        </div>
      )}

      {/* Project Info */}
      <Card title="Informações do Projeto">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID do Projeto</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">{selectedProject.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{selectedProject.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <p className="mt-1 text-sm text-gray-900">{selectedProject.description || 'Sem descrição'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Criado em</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(selectedProject.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
