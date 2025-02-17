#!/bin/bash

# Demande à l'utilisateur le dossier source
read -p "Entrez le chemin du dossier source: " source_dir

# Demande à l'utilisateur l'extension des fichiers à fusionner
read -p "Entrez l'extension des fichiers à fusionner (par exemple, .js): " file_ext

# Demande à l'utilisateur le nom du fichier de sortie
read -p "Entrez le nom du fichier de sortie (sans extension): " output_file

# Ajoute l'extension au nom du fichier de sortie
output_file="$output_file$file_ext"

# Chemin complet du fichier de sortie
output_path="$source_dir/$output_file"

# Vide le fichier de sortie s'il existe déjà
> "$output_path"

# Parcourt tous les fichiers avec l'extension spécifiée dans le dossier source et ses sous-dossiers
find "$source_dir" -type f -name "*$file_ext" | while read -r file; do
  # Vérifie que le fichier n'est pas le fichier de sortie pour éviter la boucle infinie
  if [ "$file" != "$output_path" ]; then
    # Supprime les lignes contenant 'import' et 'export' et 'export default' devant les classes
    sed '/import/d; /export {};/d; s/export default class/class/' "$file" >> "$output_path"
  fi
done

echo "Fusion terminée. Le fichier de sortie est situé à: $output_path"