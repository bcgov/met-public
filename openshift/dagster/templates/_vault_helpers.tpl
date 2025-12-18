{{- define "dagster.vaultSecretPath" -}}
{{ .Values.vault.engine }}{{ .Values.vault.path }}/engagement-patroni
{{- end -}}

{{- define "dagster.vaultRole" -}}
{{ .Values.vault.engine }}
{{- end -}}
