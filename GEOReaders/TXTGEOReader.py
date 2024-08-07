from rnanorm import CPM
import os
import gzip
import tarfile
import shutil
import pandas as pd
import GEOparse

geoid = input("What is the id of the GEO database? ")
path_data = geoid+"_RAW.tar" #This is the path format for the dataset I tested. It can easily be changed
tar = tarfile.open(path_data)

directory_data = geoid + "_data"
os.mkdir(directory_data)

mylist = []
for tarinfo in tar:
  mylist.append(os.path.splitext(tarinfo.name))

content = []
for p in mylist:
  path = geoid + "_data/" + p[0] + p[1]
  with gzip.open(path, 'rb') as f:
    file_content = f.read()
  content.append(file_content)

def formatted(array):
  array_list = []
  array = array.decode(encoding = 'utf-8').split()
  for i in range(int(len(array)/2)):
    temp_array = []
    temp_array.append(array[2*i][1:-1])
    temp_array.append(array[2*i+1])
    array_list.append(temp_array)
  return array_list

full_array_list = []
for i in range(len(content)):
  full_array_list.append(formatted(content[i]))

#Converting to DataFrame is mainly for visualizing the lists to make sure everything is all right
df_list = []
for x in full_array_list:
  df_list.append(pd.DataFrame(x, columns = [['Gene','Expression']]))

for i in range(len(df_list)):
  df_list[i] = df_list[i].drop(0)

genes_list = df_list[0]['Gene']
genes_list = list(genes_list)
#This is for the final DataFrame
expressions_list = []

def unlist(genes):
  for i in range(len(genes)):
    genes[i] = genes[i][0]
  return genes

for i in range(len(df_list)):
  blank = []
  blank.extend(unlist(df_list[i]['Expression'].values.tolist()))
  expressions_list.append(blank)

normdf = pd.DataFrame(expressions_list, columns = unlist(df_list[0]['Gene'].values.tolist()))
normdf = CPM().set_output(transform = 'pandas').fit_transform(normdf)

#This may change if the GEO dataset is formatted differently
indexlist = []
for x in mylist:
  indexlist.append(x[0][0:-4].split('_')[0])

normdf.insert(0,'index',indexlist,True)

#PHENOTYPES
gse = GEOparse.get_GEO(geo = geoid)
phenotypes = gse.phenotype_data.reset_index()
phenotypes = phenotypes.rename(columns = {'index':'Name'})

directory_output = geoid + '_output'
directory_output_csv_1 = geoid + '_output/' + geoid + '_1.csv'
directory_output_csv_2 = geoid + '_output/' + geoid + '_2.csv'
os.mkdir(directory_output)

#UPLOADING
normdf.to_csv(directory_output_csv_1, index = False, encoding = 'utf-8')
phenotypes.to_csv(directory_output_csv_2, index = False, encoding = 'utf-8)
