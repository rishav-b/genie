import GEOparse
from rnanorm import CPM
import mygene
geo_name = input("GEO Database name: ")
species = input("Species: ")
gse = GEOparse.get_GEO(geo = geo_name)
df = gse.pivot_samples("VALUE").transpose()
normdf = CPM().set_output(transform = "pandas").fit_transform(df)
normdf = normdf.reset_index()
normdf = normdf.rename(columns = {"name":"index"})
mylist = normdf.columns[1:]
types = gse.phenotype_data.reset_index()
types = types.rename(columns = {"index":"Name"})
mg = mygene.MyGeneInfo()
microarray_ids = list(df.columns)
result = mg.querymany(microarray_ids,scopes = 'reporter', fields = 'symbol', species = species)
mydict = {}
for item in result:
    mydict[item['query']] = item.get('symbol','N/A')
normdf_symbol = normdf.rename(columns = mydict)
normdf_symbol.to_csv("genie/data/"+geo_name+'_1.csv', index = False, encoding = 'utf-8')
types.to_csv("genie/data/"+geo_name+'_2.csv', index = False, encoding = 'utf-8')
