[TOC]

# 前情提要
以下是前面几节的微信推送文章：
- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)，[Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg)，[Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)，[mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/3tF6_CfSKBbtLQU4G3NpEQ)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/cN1sfcWFME7S4OJy4VIREg)，[Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/OINhALYIaH-JZICpU68icQ)
- [8差异丰度分析gneiss](https://mp.weixin.qq.com/s/wx9dr5e2B_YyqTdPJ7dVsQ)
- [9数据导入Importing data](https://mp.weixin.qq.com/s/u0k38x4lAUaghua2FDD1mQ)
- [10数据导出Exporting data](https://mp.weixin.qq.com/s/pDxDsm8vabpe9KtcLRYWxg)
- [11元数据Metadata](https://mp.weixin.qq.com/s/Q-YTeXH84lgBbRwuzc1bsg)

# QIIME 2用户文档. 12数据筛选

**Filtering data**

https://docs.qiime2.org/2020.2/tutorials/filtering/

> 注：此实例需要完成本系列文章[《1简介和安装》](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)

本教程介绍如何过滤QIIME 2中的特征表、序列和距离矩阵，软件将随着更新，新增可用的过滤功能，从而不断扩大其应用范围。

**详者注：复杂的实验通常会有非常多的条件和分组，具体分析中会根据批次、处理条件、基因型等信息进行反复筛选和分析，是分析中常用的操作。本文主讲特征表(Feature/OTU table)和距离矩阵的筛选，是分析大项目中常用的技术。**

## 下载实验相关数据

**Obtain the data**

```
# 创建工作目录并进入
mkdir -p qiime2-filtering-tutorial
cd qiime2-filtering-tutorial

# 下载实验设计、特征表和距离矩阵
wget -c \
  -O "sample-metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/moving-pictures/sample_metadata.tsv"
wget -c \
  -O "table.qza" \
  "https://data.qiime2.org/2020.2/tutorials/filtering/table.qza"
wget -c \
  -O "distance-matrix.qza" \
  "https://data.qiime2.org/2020.2/tutorials/filtering/distance-matrix.qza"
wget -c \
  -O "taxonomy.qza" \
  "https://data.qiime2.org/2020.2/tutorials/filtering/taxonomy.qza"
wget -c \
  -O "sequences.qza" \
  "https://data.qiime2.org/2020.2/tutorials/filtering/sequences.qza"
```

## 过滤特征表

**Filtering feature tables**

在本教程的这一节中，我们将看到如何从特征表中过滤（例如：删除）样本和特征。特征表有两个轴：样本轴和特征轴。本教程中描述的过滤操作通常分别适用于过滤样本`filter-samples`和过滤特征`filter-features`对应的样本轴和特征轴。这两种方法都在`q2-feature-table`插件中实现。基于分类的过滤也可以使用`q2-taxa`插件中的方法从特征表中过滤特征`filter-table`。

### 按数据量过滤

**Total-frequency-based filtering**

基于总频率的过滤用于根据样本或特征在特征表中出现的频率进行过滤。

例如，在过滤样本时，可以使用此功能来过滤样本，其总频率在样本频率分布中是一个异常值。在许多16S研究中，一些样本只会获得少数（可能个位数至几百）条序列，这可能是由于样本生物量低导致DNA提取率低。在这种情况下，用户可能希望根据其最小总频率（即样本测序的序列总数）删除样本。可以通过以下方式实现（在本例中，总频率小于1500的样本将被过滤掉）。

```
time qiime feature-table filter-samples \
  --i-table table.qza \
  --p-min-frequency 1500 \
  --o-filtered-table sample-frequency-filtered-table.qza
```

输出对象:

- `distance-matrix.qza`: 距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fdistance-matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/distance-matrix.qza)
- `taxonomy.qza`: 物种注释。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftaxonomy.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/taxonomy.qza)
- `sequences.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsequences.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/sequences.qza)
- `table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftable.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/table.qza)
- `sample-frequency-filtered-table.qza`: 过滤后的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsample-frequency-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/sample-frequency-filtered-table.qza)

按特征表的数据量过滤，只有特征序列总测序量大于10条以上的才保留

详者注：(实验中会有大量低丰度的特征/OTU，它们会增加计算工作量和影响高丰度结果差异比较时FDR校正Pvalue，导致假阴性，通常需要选择一定的阈值进行筛选，常用的有相对丰度千分之五、千分之一、万分之五、万分之一；也可根据测序总量，reads频率的筛选阈值常用2、5、10等，大项目样本多数据量大，有时甚至超过100，推荐最小丰度为百万分之一)  

```
# 过滤低丰度，< 10, 5s
time qiime feature-table filter-features \
  --i-table table.qza \
  --p-min-frequency 10 \
  --o-filtered-table feature-frequency-filtered-table.qza
```

- `feature-frequency-filtered-table.qza`: 包括特征检测至少10次以上的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ffeature-frequency-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/feature-frequency-filtered-table.qza)

有时也会过滤掉高丰度的特征/ASV/OTU或样本，因为极高样本也可能异常，需要使用`--p-max-frequency`参数。

### 偶然因素的过滤

**Contingency-based filtering**

举个栗子，你有实验和对照组各有十个样品的生物学重复，结果中会有很多OTU/特征只在一个样品中出现，而在其他所有样品中均为零，这种情况一般认为是偶然因素的结果，不具有普遍性，有生物学意义的可能性也比较小，因此通常过滤掉他们，以减少下游分析工作量，降低结果的假阴性率。

```
# 过滤至少在2个样品中存在的Feature，去除偶然的Feature，5s
time qiime feature-table filter-features \
  --i-table table.qza \
  --p-min-samples 2 \
  --o-filtered-table sample-contingency-filtered-table.qza
```

- `ample-contingency-filtered-table.qza`: 包括特征检测至少10次以上的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsample-contingency-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/sample-contingency-filtered-table.qza)

同理，样品中包括极少的特征，也可以过滤掉。去除频率总数小于10个Feature的样品(根据具体情况，有些样品微生物种类极低，可能是异常，如服用过抗生素或PCR扩增出现问题)，一般也要筛选后再分析。

```
# 5s
time qiime feature-table filter-samples \
  --i-table table.qza \
  --p-min-features 10 \
  --o-filtered-table feature-contingency-filtered-table.qza
```

- `feature-contingency-filtered-table.qza`: 包括特征检测至少10次以上的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ffeature-contingency-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/feature-contingency-filtered-table.qza)

同样上面筛选最小值，有时也会筛选最大值，它们的参数为`--p-max-features`和`--p-max-samples`。

### 基于标识符的过滤

**Identifier-based filtering**

比如实验中的某些样品发现问题，如生长过程到受胁迫、人或动物吃错药(某些人源样品查出末如实申报的抗生素使用)，需要在实验中进行剔除。或挑选指定的样品下游分析。

```
# 生成一个需要保留或剔除的样品列表(也可以手动编写文本文件)
echo SampleID > samples-to-keep.tsv
echo L1S8 >> samples-to-keep.tsv
echo L1S105 >> samples-to-keep.tsv
```

然后使用`filter-samples`依照样本列表进行过滤。

```
# 只保留指定的两个样品L1S8和L1S105
time qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file samples-to-keep.tsv \
  --o-filtered-table id-filtered-table.qza
```

- `feature-contingency-filtered-table.qza`: 包括特征检测至少10次以上的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fid-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/id-filtered-table.qza)


### 基于元数据的筛选

**Metadata-based filtering**

**这是最常用的，重点关注**

基于元数据的筛选与基于标识符的筛选类似，只是要保留的ID列表是基于元数据搜索条件而不是由用户直接提供的。这是使用`--p-where`参数和`--m-metadata-file`参数实现的。用户使用`--p-where`提供了基于元数据应保留样本的描述，其描述的语法是[`SQLite WHERE-clause`语法](https://en.wikipedia.org/wiki/Where_(SQL))。

例如，过滤表以仅包含来自`分组1(subject 1)`的样本，如下所示。这里，`--p-where`参数指定我们要保留`sample-metadata.tsv`中分组为`subject-1`的所有样本。注意，值`subject-1`必须用单引号括起来。

```
# 筛选某个条件下一类：元数据Subject列中，名为subject-1的所有样品,5s
qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "Subject='subject-1'" \
  --o-filtered-table subject-1-filtered-table.qza
```

筛选后结果：

- `subject-1-filtered-table.qza`: 某类的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsubject-1-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/subject-1-filtered-table.qza)


如果一个元数据列中想要保留多个分组，则可以使用`IN`子句指定这些值。例如，可以使用以下命令保留所有皮肤样本，其中包括的左掌和右掌的值用单引号括起来。

```
# 筛选某个条件下多类：身体取样部分中左掌和右掌的样品
qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "[body-site] IN ('left palm', 'right palm')" \
  --o-filtered-table skin-filtered-table.qza
```

筛选后结果：

- `skin-filtered-table.qza`: 某类的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fskin-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/skin-filtered-table.qza)


`--p-where`表达式可以使用`AND`和`OR`组合关键字。对`sample-metadata.tsv`中的样本进行筛选，这里`--p-where`参数指定我们只保留其分组为`subject-1`且其`bodysite`位于`gut`的样品。对于要保留的示例，使用`AND`关键字时，要计算的两个表达式都必须为`true`。这意味着其身体部位是肠道但其Subject是`subject-2`的样本不会出现在结果表中。同样，subject为`subject-1`但其身体部位不是肠道的样本也不会出现在结果表中。

```
# 同时筛选两个条件共有(和关系/交集)：Subject列中subject-1组且在BodySite中的gut
qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "[subject]='subject-1' AND [body-site]='gut'" \
  --o-filtered-table subject-1-gut-filtered-table.qza
```

**筛选后结果**：

- `subject-1-gut-filtered-table.qza`: 某类的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsubject-1-gut-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/subject-1-gut-filtered-table.qza)


`OR`关键字语法类似于`AND`关键字语法，但指定对于要保留的样本，两个表达式中的任何一个都可以为true即可。由于缺少与此处使用的示例数据更相关的应用，本示例中的`OR`关键字将应用于保留`body-site`为`gut`或在`sample-metadata.tsv`中`reported-antibiotic-usage`为`Yes`的所有样品。与`AND`和不同的是，这意味着，如果样本的`body-site`是`gut`，但其`reported-antibiotic-usage`为`No`，则会出现在结果表中。同样，`reported-antibiotic-usage`是`Yes`，但其`body-site`不是`gut`的样本也将出现在结果表中。

```
# 同时筛选两个条件并集：BodySite例为gut或ReportedAntibioticUsage为Yes
qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "[body-site]='gut' OR [reported-antibiotic-usage]='Yes'" \
  --o-filtered-table gut-abx-positive-filtered-table.qza
```

**筛选后结果**：

- `subject-1-gut-filtered-table.qza`: 某类的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fgut-abx-positive-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/gut-abx-positive-filtered-table.qza)


此语法还支持否定`--p-where`表达式（或整个表达式）的各个子句。这里，在`sample-metadata.tsv`中，`--p-where`参数指定我们只保留`subject`为`subject-1`且其`body-site`不属于`gut`的样本。

```
# 使用非NOT进行条件筛选：subject-1组中非肠道的样品
qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "[subject]='subject-1' AND NOT [body-site]='gut'" \
  --o-filtered-table subject-1-non-gut-filtered-table.qza
```

**筛选后结果**：

- `subject-1-gut-filtered-table.qza`: 某类的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsubject-1-non-gut-filtered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/subject-1-non-gut-filtered-table.qza)

## 基于物种过滤表和序列

**Taxonomy-based filtering of tables and sequences**

基于物种注释的过滤(Taxonomy-based filtering)是一种非常常见的过滤`feature-metadata-based`方法，因此`q2 taxa`插件提供了`filter-table`方法来简化这个过程。过滤可以应用于仅使用`--p-include`保留特定的分类和/或使用`--p-exclude`删除特定的分类。

如果物种分类注释包含某些特定的文本，则可以使用`--p-exclude`参数删除这些物种。例如，这里使用`-p-exclude`从表中删除注释为`线粒体`的所有物种。当使用`--p-mode`（默认）进行搜索时，**搜索词不区分大小写**，因此搜索词`线粒体`将返回与搜索词`线粒体`Mitochondria相同的结果。

```
qiime taxa filter-table \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-exclude mitochondria \
  --o-filtered-table table-no-mitochondria.qza
```

**筛选后结果**：

- `table-no-mitochondria.qza`: 过滤线粒体的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftable-no-mitochondria.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/table-no-mitochondria.qza)

通过在逗号分隔的列表中提供搜索词，可以实现删除与多个搜索词匹配结果。以下命令将删除其分类注释中包含线粒体或叶绿体的所有特征。（在宿主相关的微生物组研究中，去除线粒体和叶绿体是必须的，如扩增叶际微生物时，由于叶片比例高，叶绿体高拷贝数，总数据量中90%，甚至99%可能全是叶绿体）

```
qiime taxa filter-table \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-exclude mitochondria,chloroplast \
  --o-filtered-table table-no-mitochondria-no-chloroplast.qza
```

**筛选后结果**：

- `table-no-mitochondria-no-chloroplast.qza`: 过滤线粒体和叶绿体的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftable-no-mitochondria-no-chloroplast.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/table-no-mitochondria-no-chloroplast.qza)

使用`--p-include`参数过滤表以只保留特定的特性。例如，`--p-include`可用于仅保留至少已注释到门级别的功能。在`greengenes`分类法中（用于生成这里提供`FeatureTable[Taxonomy]`），所有的门注释都以文本`p__`开头。如果某个功能没有分配给某个门（即它最多包含一个`kingdom/domain`），那么它不应该包含文本`p__`。因此，我们可以在这里使用`p__`作为`--p-include`包含术语，以仅保留包含门级注释的物种。在实践中，这个过滤器对于过滤那些在分类上不太可能提供关于您的样本信息的特性很有用。(相当于只**筛选比较确定属于细菌或古菌门的序列，可以有效去除宿主非特异扩增污染和其它未知来源的序列**)

```
qiime taxa filter-table \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-include p__ \
  --o-filtered-table table-with-phyla.qza
```

**筛选后结果**：

- `table-with-phyla.qza`: 仅包含已知门的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftable-with-phyla.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/table-with-phyla.qza)


可以组合`--p-include`和`--p-exclude`参数。以下命令将保留包含门级注释的所有物种，但在其分类注释中排除包含线粒体或叶绿体的所有序列。

**重点：筛选16S扩增目标对象，且排除宿主污染**

```
qiime taxa filter-table \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-include p__ \
  --p-exclude mitochondria,chloroplast \
  --o-filtered-table table-with-phyla-no-mitochondria-no-chloroplast.qza
```

**筛选后结果**：

- `table-with-phyla-no-mitochondria-no-chloroplast.qza`: 仅包含已知门的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftable-with-phyla-no-mitochondria-no-chloroplast.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/table-with-phyla-no-mitochondria-no-chloroplast.qza)

默认情况下，请为`--p-include`或`--p-exclude`提供包含在分类注释中可匹配词汇。如果您希望您的词汇只有在它们是完整的分类注释的情况下才匹配，那么可以通过传递`--p-mode-exact`（表示搜索需要精确匹配）来实现。当**使用`-p-mode exact`搜索时，搜索词区分大小写，因此搜索词线粒体不会返回与搜索词线粒体相近的结果**。

去除线粒体序列的精确匹配可以实现如下，防止删除其它与线粒体相近的物种。（在greengenes分类中，有时有与线粒体注释相关的科注释，因此该命令可能不会删除所有注释为线粒体的特征。）

```
qiime taxa filter-table \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-mode exact \
  --p-exclude "k__Bacteria; p__Proteobacteria; c__Alphaproteobacteria; o__Rickettsiales; f__mitochondria" \
  --o-filtered-table table-no-mitochondria-exact.qza
```

**筛选后结果**：

- `table-no-mitochondria-exact.qza`: 精确匹配过滤线粒体后的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Ftable-no-mitochondria-exact.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/table-no-mitochondria-exact.qza)

基于分类的表过滤也可以使用`qiime feature-table filter-features`和`--p-where`参数来实现。如果想要高级筛选或查询，可通过`qiime taxa filter-table`支持的复杂查询，则应使用`qiime feature-table filter-features`。


## 过滤序列

**Filtering sequences**

`q2-taxa`插件提供了一种方法`filter-seqs`，用于根据功能的分类注释过滤代表序列`FeatureData[Sequence]`。该功能与`qiime taxa filter-table`中提供的功能非常相似，因此您应该参考上面的`qiime taxa filter-table`示例，以了解有关基于分类筛选的更多信息。简单地说，`filter-seqs`可以保留包含门级注释的所有特征，但在其分类注释中排除包含线粒体或叶绿体的所有特征对应的序列。

```
qiime taxa filter-seqs \
  --i-sequences sequences.qza \
  --i-taxonomy taxonomy.qza \
  --p-include p__ \
  --p-exclude mitochondria,chloroplast \
  --o-filtered-sequences sequences-with-phyla-no-mitochondria-no-chloroplast.qza
```

**筛选后结果**：

- `sequences-with-phyla-no-mitochondria-no-chloroplast.qza`: 门水平无线粒体和叶线体的代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsequences-with-phyla-no-mitochondria-no-chloroplast.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/sequences-with-phyla-no-mitochondria-no-chloroplast.qza)


`q2-feature-table`插件还具有一个`filter-seqs`方法，允许用户根据各种标准删除序列，包括特征表中存在哪些物种。

另请参见`q2-quality-control`插件，它具有一个`exclude-seqs`操作，用于**根据对一组参考序列或引物的对齐来过滤序列**。这样可以只筛选引物特异扩增的序列，去除非特异扩增结果。

## 过滤距离矩阵

**Filtering distance matrices**

在本教程的这一节中，我们将看到如何使用`q2-diversity`插件提供的过滤距离矩阵`filter-distance-matrix`方法从距离矩阵中过滤（如删除）样本。

> 注: 过滤距离矩阵的工作方式与通过标识符或示例元数据过滤特征表的原理相同。本节中提供的示例很简单；有关详细信息，请参阅上面的基于标识符的筛选和基于元数据的筛选。

可以根据标识符过滤距离矩阵。例如，要过滤距离矩阵以保留上面`samples-to-keep.tsv`中指定的两个样本（详细请参见[基于标识符的过滤`Identifier-based filtering`](https://docs.qiime2.org/2020.2/tutorials/filtering/#identifier-based-filtering)）

```
# 按样品名过滤
qiime diversity filter-distance-matrix \
  --i-distance-matrix distance-matrix.qza \
  --m-metadata-file samples-to-keep.tsv \
  --o-filtered-distance-matrix identifier-filtered-distance-matrix.qza
```


**筛选后结果**：

- `identifier-filtered-distance-matrix.qza`: 根据样本过滤的距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fidentifier-filtered-distance-matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/identifier-filtered-distance-matrix.qza)

还可以基于样品元数据中分组条件过滤距离矩阵。例如，要过滤距离矩阵以仅保留来自`subject 2`的样本：

```
# 按实验设计中的某条件中的组过滤
qiime diversity filter-distance-matrix \
  --i-distance-matrix distance-matrix.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "[subject]='subject-2'" \
  --o-filtered-distance-matrix subject-2-filtered-distance-matrix.qza
```

- `identifier-filtered-distance-matrix.qza`: 根据分组过滤的距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffiltering%2Fsubject-2-filtered-distance-matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/filtering/subject-2-filtered-distance-matrix.qza)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为宏基因组数据分析和植物微生物组，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20+篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1200万+。

## Reference

https://docs.qiime2.org/2020.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 猜你喜欢

- 10000+: [菌群分析](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)  
[宝宝与猫狗](http://mp.weixin.qq.com/s/K3y3an-EaX8iaytmxdzHqA) [提DNA发Nature](http://mp.weixin.qq.com/s/lO5uiMjixJ6aYTjPX-IyaQ) [实验分析谁对结果影响大](http://mp.weixin.qq.com/s/cL_IAoPFfmelKMPMgltrfA)  [Cell微生物专刊](https://mp.weixin.qq.com/s/fN0gpD3bZJDXSp8x4ck-3Q) [肠道指挥大脑](https://mp.weixin.qq.com/s/pZO20VGl3Tf_OtFIbZ-zWw)
- 系列教程：[微生物组入门](http://mp.weixin.qq.com/s/sQyl5EctXFB95Oxg8YIasg) [Biostar](http://mp.weixin.qq.com/s/JL-n2nD6YL8vwuRtTVmQlQ) [微生物组](http://mp.weixin.qq.com/s/li7SdZVaCEyFQF8h6MMh2A)  [宏基因组](http://mp.weixin.qq.com/s/bcyvhFrNr6niqD13rQfZeg) 
- 专业技能：[生信宝典](http://mp.weixin.qq.com/s/2b3_8Vvv7McqCkEfUszW3A) [学术图表](http://mp.weixin.qq.com/s/SCT4oso_vI0UNIJZTaG95g) [高分文章](http://mp.weixin.qq.com/s/kD-x7K4hI5KMgGXikyLt0Q) [不可或缺的人](http://mp.weixin.qq.com/s/1nf7vwyvC3oemkTq_pu87A) 
- 一文读懂：[宏基因组](http://mp.weixin.qq.com/s/Vsm6BJgqsSvxEenIBrGVLw) [寄生虫益处](https://mp.weixin.qq.com/s/hX0K9TOLPnrZ6f8lUoSYag) [进化树](https://mp.weixin.qq.com/s/GV8rU3FZdc8Y-x931k_yrQ)
- 必备技能：[提问](http://mp.weixin.qq.com/s/xCif04bqZB14Z4OvesK0SQ) [搜索](http://mp.weixin.qq.com/s/wn2bqIPgT5UD-GP1qzkJFA)  [Endnote](http://mp.weixin.qq.com/s/SPblPs5ByPdb2C400kIK3w)
- 文献阅读 [热心肠](http://mp.weixin.qq.com/s/1uBeAQ0utxuzTTtfUx_UXA) [SemanticScholar](https://mp.weixin.qq.com/s/gaQiUrRqLpfTXzjyfbua6A) [Geenmedical](https://mp.weixin.qq.com/s/hc8g64aHN7qv8YhVfrsuvQ)
- 扩增子分析：[图表解读](http://mp.weixin.qq.com/s/oiVHO2S1JgYrKXPDU6fH2g) [分析流程](http://mp.weixin.qq.com/s/KrYyy3jjzAL0rQzVfV6h4A) [统计绘图](http://mp.weixin.qq.com/s/6tNePiaDsPPzEBZjiCXIRg) 
- [16S功能预测](http://mp.weixin.qq.com/s/sztbvfdf9wa-3HJXc_m8TQ)   [PICRUSt](https://mp.weixin.qq.com/s/LWtiwBbUCAadMZPaKKDMag)  [FAPROTAX](http://mp.weixin.qq.com/s/J8EwJD_PTDhqRaD7kXlK1A)  [Bugbase](https://mp.weixin.qq.com/s/1WdysPZWo0H6NSYiNpcMUQ) [Tax4Fun](http://mp.weixin.qq.com/s/dzsh44ue93xnAs7gTde7wg)
- 在线工具：[16S预测培养基](http://mp.weixin.qq.com/s/YIrDqNvDX0XMazCGxhH1Lg) [生信绘图](http://mp.weixin.qq.com/s/O0QAQyfxnrXlFLw268B7lg)
- 科研经验：[云笔记](http://mp.weixin.qq.com/s/OnwhWlq3cTycf-W1rxgV7g)  [云协作](http://mp.weixin.qq.com/s/W5By9mZ5PI57_xFfZ_JXiw) [公众号](http://mp.weixin.qq.com/s/hd0sdBDAMqMJsXQs0pIjUg)
- 编程模板: [Shell](http://mp.weixin.qq.com/s/YevGR79NnBAF-xtrqL8gAA)  [R](http://mp.weixin.qq.com/s/OQiE882jM6pVwqTiIjyZ1Q) [Perl](http://mp.weixin.qq.com/s/u2ZmTo-z6cbN-L6KVLYNwg) 
- 生物科普: [肠道细菌](http://mp.weixin.qq.com/s/3T768LA6MWujF4yuzK4MKQ) [人体上的生命](http://mp.weixin.qq.com/s/_DUI6tOYTEq0Wu7K7iRTxw) [生命大跃进](http://mp.weixin.qq.com/s/O_0Il0G_v_aSwkUH_noZVA)  [细胞暗战](http://mp.weixin.qq.com/s/M35ebWAelDIK5Iqib06JzA) [人体奥秘](https://mp.weixin.qq.com/s/xlCdN8il1hcutkYK-42fAQ)  

## 写在后面

为鼓励读者交流、快速解决科研困难，我们建立了“宏基因组”专业讨论群，目前己有国内外5000+ 一线科研人员加入。参与讨论，获得专业解答，欢迎分享此文至朋友圈，并扫码加主编好友带你入群，务必备注“姓名-单位-研究方向-职称/年级”。技术问题寻求帮助，首先阅读[《如何优雅的提问》](http://mp.weixin.qq.com/s/H9gkepap0hy3NNskOkO44w)学习解决问题思路，仍末解决群内讨论，问题不私聊，帮助同行。
![image](http://bailab.genetics.ac.cn/markdown/life/yongxinliu.jpg)

学习扩增子、宏基因组科研思路和分析实战，关注“宏基因组”
![image](http://bailab.genetics.ac.cn/markdown/life/metagenome.jpg)

![image](http://bailab.genetics.ac.cn/markdown/train/1809/201807.jpg)

点击阅读原文，跳转最新文章目录阅读
https://mp.weixin.qq.com/s/5jQspEvH5_4Xmart22gjMA
