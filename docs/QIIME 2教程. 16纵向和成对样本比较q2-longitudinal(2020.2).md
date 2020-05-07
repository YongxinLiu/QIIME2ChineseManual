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
- [12数据筛选Filtering data](https://mp.weixin.qq.com/s/zk-pXJs4GNwb1AOBPzCaHA)
- [13训练特征分类器Training feature classifiers](https://mp.weixin.qq.com/s/jTRUYgacH5WszsHJVbbh4g)
- [14数据评估和质控Evaluating and controlling](https://mp.weixin.qq.com/s/1b3Hj23bKWfTkHKAPNmCBQ)
- [15样品分类和回归q2-sample-classifier](https://mp.weixin.qq.com/s/3DGvuD3R9atSoo2CSrUJBw)


# 进行纵向和成对样本比较`q2-longitudinal`

**Performing longitudinal and paired sample comparisons with q2-longitudinal**

https://docs.qiime2.org/2020.2/tutorials/longitudinal/

> 注：最好按本教程顺序学习，想直接学习本章，至少完成本系列[《1简介和安装》](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)。

本教程将演示`q2-longitudinal`的各种特性，这个插件支持纵向研究设计和成对样本的统计和可视化比较，以确定样本在观察“状态”之间是否或如何变化。“状态”通常与时间或环境梯度有关，**对于成对分析（成对距离和成对差异），样本对通常由在两个不同时间点观察到的同一个体组成。例如，在接受治疗之前和之后收集临床研究中患者的粪便样本**。

“状态`States`”通常也可以是方法论的，在这种情况下，样本对通常是同一个人同时使用两种不同的方法。例如，`q2-longitudinal`可以比较不同采集方法、存储方法、DNA提取方法或任何生物信息处理步骤对单个样本特征组成的影响。

> 注释：`q2-longitudinal`中的许多操作都将度量值`metric`作为输入，通常是元数据文件中的列名或元数据可转换的对象（包括alpha多样性向量、PCoA结果和许多其他QIIME 2对象）或特征表中的特征ID。元数据文件和元数据可转换对象中有效度量值的名称，可以使用元数据表格命令`metadata tabulate`进行检查和可视化。可以使用`feature-data summary`命令检查有效的特征名称（用作与特征表关联的度量值）。

以下流程图说明了所有纵向分析所涉及的工作流程（图1）。下面的教程将更详细地描述这些操作中的每一个步骤。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.01.png)
图1.  纵向样本分析流程

在下面的实例中，我们使用来自ECAM研究的数据(2016年科学转化医学的一篇文章)，这是一项对婴儿和母亲从出生到2岁过程微生物组的纵向研究。首先，我们创建一个新目录并下载相关的测试数据。

```
mkdir -p longitudinal-tutorial
cd longitudinal-tutorial

wget -c \
  -O "ecam-sample-metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/sample_metadata.tsv"

# 从上节文件夹复制
cp ../sample-classifier-tutorial/ecam-metadata.tsv ./ecam-sample-metadata.tsv

wget \
  -O "shannon.qza" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/ecam_shannon.qza"  

wget \
  -O "unweighted_unifrac_distance_matrix.qza" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/unweighted_unifrac_distance_matrix.qza"
```

## 成对差异比较

**Pairwise difference comparisons**

成对差异测试确定成对样本（例如，治疗前和治疗后）之间特定指标的值是否发生显著变化。

该可视化工具目前支持对特征表中的特征丰度（例如微生物序列变体ASV或分类群）或示例元数据文件中的元数据值进行比较。α多样性值（如观察到的序列数量）和β多样性值（如主坐标轴数值）是与这些测试进行比较的常用指标，应包含在作为输入提供的元数据文件中。在下面的示例中，我们将根据分娩方式(delivery)分组测试ECAM数据中两个不同时间点之间的α多样性（香农多样性指数）是否发生显著变化。

```
# 15s
time qiime longitudinal pairwise-differences \
  --m-metadata-file ecam-sample-metadata.tsv \
  --m-metadata-file shannon.qza \
  --p-metric shannon \
  --p-group-column delivery \
  --p-state-column month \
  --p-state-1 0 \
  --p-state-2 12 \
  --p-individual-id-column studyid \
  --p-replicate-handling random \
  --o-visualization pairwise-differences.qzv
```

**输入对象:**

- `unweighted_unifrac_distance_matrix.qza`: 非权重unifrac矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Funweighted_unifrac_distance_matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/unweighted_unifrac_distance_matrix.qza)
- `shannon.qza`: 香农多样性指数。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fshannon.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/shannon.qza)

**输出可视化:**

- `pairwise-differences.qzv`: 成对比较结果可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fpairwise-differences.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/pairwise-differences.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.02.jpg)

## 成对距离比较

**Pairwise distance comparisons**

成对距离`pairwise-distances`可视化器还可以评估来自两个不同“状态states”的成对样本之间的变化，但是它不是使用元数据列或对象作为输入，而是在距离矩阵上进行操作以评估“前”和“后”样本对之间的距离 ，并检验`group-column`参数指定的不同组之间的配对差异是否显着不同。 在这里，我们使用此动作来比较ECAM数据集中12个月时间范围内阴道出生和剖宫产婴儿的微生物群组成的稳定性。

```
# 17s
time qiime longitudinal pairwise-distances \
  --i-distance-matrix unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-group-column delivery \
  --p-state-column month \
  --p-state-1 0 \
  --p-state-2 12 \
  --p-individual-id-column studyid \
  --p-replicate-handling random \
  --o-visualization pairwise-distances.qzv
```

**输出可视化:**

- `pairwise-distances.qzv`: 成对比较距离的可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fpairwise-distances.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/pairwise-distances.qzv)

成对变化是不可忽略的因素，我们看到组间没有显著差异。

## 线性混合效应模型

**Linear mixed effect models**

**线性混合效应（LME）模型测试单个响应变量与一个或多个独立变量之间的关系，其中观察是在依赖样本之间进行的**，例如在重复测量抽样实验中。开展此分析将至少一个数值状态列`state-column`（例如，时间）和一个或多个逗号分隔的组列`group-columns`（可以是分类或数值元数据列；这些是固定效果）作为LME模型中的独立变量，并将响应变量的回归图（“metric”）作为状态列的函数和每个组列。此外，`individual-id-column`参数应该是一个元数据列，该列指示重复采样的单个类型或地点。响应变量可以是示例元数据映射文件列，也可以是特征表中的特征ID。也可以将逗号分隔的随机效果列表输入到该操作中；默认情况下，包括每个个体的随机截距，但用户可能希望使用的另一个常见随机效果是每个个体的随机斜率，可以使用状态列`state-column`值作为随机效应`random-effects`参数的输入来设置该斜率。在这里，我们**使用LME在ECAM数据集中测试alpha多样性（香农多样性指数）是否随时间变化以及对分娩方式、饮食和性别的响应**。

> 注释: **决定一个因素是固定效应还是随机效应可能很复杂**。一般来说，**如果不同的因子级别（元数据列值）表示（或多或少）所有可能的离散值，那么因子应该是固定效应**。例如，在下面的例子中，**分娩方式、性别和饮食（主要是母乳喂养或配方奶粉喂养）被指定为固定效应**。相反，如果一个因子的值代表一个总体的随机样本，那么它应该是一个随机效应。例如，我们可以想象有一些元数据变量，如**体重、母乳中的每日卡路里kcal、每天吃的花生数量或每天服用的青霉素毫克数；这些值代表一个群体中的随机样本，不太可能代表整个群体的所有可能值**。不确定你实验中的因素吗？🤔咨询统计学家或身边有名的统计专家以获得指导。📚

```
# 1s
time qiime longitudinal linear-mixed-effects \
  --m-metadata-file ecam-sample-metadata.tsv \
  --m-metadata-file shannon.qza \
  --p-metric shannon \
  --p-group-columns delivery,diet,sex \
  --p-state-column month \
  --p-individual-id-column studyid \
  --o-visualization linear-mixed-effects.qzv
```

输出可视化：

- `linear-mixed-effects.qzv`:线性混合效应模型。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Flinear-mixed-effects.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/linear-mixed-effects.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.04linear-mixed-effects.jpg)

此命令生成的可视化工具包含多个结果。首先，为了方便起见，输入参数显示在可视化的顶部（例如，当翻看多个可视化时，有摘要信息是非常有帮助的）。接下来，“模型摘要model summary”显示了有关接受训练LME模型的一些描述性信息。这只是显示关于“组”的描述性信息；在本例中，组将是个人（`--p-individual-id`列设置）。要检查的主要结果是“模型摘要”下面的“模型结果model results”。这些结果总结了每个固定效应（及其相互作用interactions）对因变量（香农多样性shannon diversity）的影响。此表显示每个参数的参数估计值、估计标准误差、z-scores、p值和95%置信区间上限和下限(parameter estimates, estimate standard errors, z scores, P values (P>|z|), and 95% confidence interval upper and lower bounds for each parameter)。我们在这张表中看到香农的多样性受到出生月份(month of life)和饮食以及几个相互作用因素的显著影响。有关LME模型和这些数据解释的更多信息，可在[`StatsModels LME`描述页面上找到，该页面提供了许多有用的技术参考，以供进一步阅读](http://www.statsmodels.org/dev/mixed_linear.html)。

最后，每个“组列”分类的散点图显示在可视化的底部，每个组都有线性回归线（加上95%的灰色置信区间）。如果启用了`--p-lowess`参数，则为每个组显示本地加权平均值。显示了两组不同的散点图。首先，回归散点图显示了每个样本的状态列（x轴）和度量（y轴）之间的关系。这些图只是作为一个快速总结供参考；建议用户使用波动性(volatility)可视化工具对其纵向数据进行交互式绘图。波动率图(Volatility plots)可用于定性地识别异常值，这些异常值会不成比例地驱动个体和群体内的差异，包括通过检查与控制限相关的残差（有关更多详细信息，请参见下面的注释和“波动率分析Volatility analysis”一节）。

第二组散点图是拟合与残差图(fit vs. residual plots)，显示每个样本（在x轴上）的预测与每个样本（在y轴上）的残差或观测误差（预测-实际值）之间的关系。**在测量值的范围内，残差应大致以零为中心且正态分布。不确定、系统性高或低以及自相关值可能暗示模型较差**。如果你的残基图看起来像非常混乱，而观测值之间没有任何明显的关系，那么说明你做得很好。如果您**看到U形曲线或其他非随机分布，则预测变量（组列和/或随机效应）无法捕获所有解释信息**，导致信息**泄漏到您的残差中，或者您没有为数据使用适当的模型**。检查预测变量和可用的元数据列，确保没有遗漏任何内容。

> 注释：如果你想点你第i的并且交叉你的第t的样本的残基和预测值，可以在回归散点图下面的“下载原始数据作为tsv”的链接中获得。该文件可以作为元数据输入到波动性可视化工具中，**以检查残差是否与其他元数据列相关。如果是，那么这些列应该在模型中用作预测变量**！控制限制（±2和3标准偏差）可以切换开/关以轻松识别异常值，这对于使用该可视化工具重新检查拟合与残基图时尤其有用。🍝


## 波动性分析

**Volatility analysis**

波动性可视化工具生成交互式线图，使我们能够评估一个因变量在一个或多个组中的连续、独立变量在时间上的波动性。可以使用多个元数据文件（包括alpha和beta多样性对象）和`FeatureTable[RelativeFrequency]`表作为输入，在交互式可视化中，我们可以选择不同的因变量绘制在Y轴上。

在这里，我们研究了ECAM队列中香农多样性和其他元数据随时间的变化（用状态列参数设置），包括样本组（如下所述交互选择）和个体受试者（用个体ID`individual-id-column`列参数设置）。

```
# 34s
time qiime longitudinal volatility \
  --m-metadata-file ecam-sample-metadata.tsv \
  --m-metadata-file shannon.qza \
  --p-default-metric shannon \
  --p-default-group-column delivery \
  --p-state-column month \
  --p-individual-id-column studyid \
  --o-visualization volatility.qzv
```

**输出可视化：**

- `volatibility.qzv`: 波动性图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Flinear-mixed-effects.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/linear-mixed-effects.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.04volatility.jpg)

在结果可视化中，一个线图出现在网页的左侧，一个“绘图控件Plot Controls”面板出现在右侧或下方(由你的网页宽度决定)。这些“绘图控件”可以交互地调整几个变量和参数。这允许我们确定组和个人的值如何在单个独立变量(如state列)随出生时间的变化。此可视化中的有用的功能包括：

1. “度量列Metric column”选项卡允许我们选择要在Y轴上绘制的连续元数据值。在此操作的元数据/项目输入中找到的所有连续数字列都将显示为此下拉选项卡中的选项。在本例中，可视化中绘制的初始变量是香农(shannon)指数，因为此列由可选的默认度量参数指定。
2. “组列Group column”选项卡允许我们选择用于计算平均值的分类元数据值。在此操作的元数据/项目输入中找到的所有分类元数据列都将显示为此下拉选项卡中的选项。这些平均值绘制在线图上，这些**平均线的宽度和不透明度可以使用可视化右侧“绘图控件”中的滑块进行修改。误差线（标准偏差）可以通过“绘图控件”中的按钮打开和关闭。**
3. 每个个体的纵向值都被绘制成“意大利面spaghetti”线（所谓的“意大利面”线是因为单个向量的缠结质量看起来像一个意大利面球）。意大利面的厚度和不透明度可以使用右侧可视化“绘图控件”中的滑块进行修改。
4. 可以使用“配色方案Color scheme”选项卡调整配色方案。
5. 全局平均值(global mean)和警告或控制限值(warning/control limits，与全局平均值的2倍和3倍标准偏差）可通过“绘图控制面板”中的按钮打开或关闭。绘制这些值的目的是显示变量相对于平均值随时间（或梯度）的变化情况。与平均值的大偏差可能会超过警告/控制限值，表明在该状态下发生了重大扰动；例如，可以使用这些图跟踪抗生素使用或影响多样性的其他干扰。
6. 组平均线和意大利面点(dot)也可以通过“绘图控件”中的“散点大小”和“散点不透明度”滑块进行修改。它们调整单个点的大小和不透明度。最大化散点不透明度和最小化线不透明度，以将这些转换为纵向散射图！
7. 将鼠标悬停在感兴趣的点上，可以查看各个点上的相关示例元数据。

如果这个可视化的交互功能没能让您满意，点击“绘图控件”顶部的“在Vega编辑器中打开”按钮，定制你的核心内容。这将在Vega编辑器中打开一个手动代码编辑绘图特征的窗口，Vega编辑器是QIIME 2外部的可视化工具。允许你更高级的定制和修改交互图形。

好啊！ 🍝

## 第1个差异法跟踪变化率

**First differencing to track rate of change**

**查看时间序列数据的另一种方法是评估变化率随时间的变化**。我们可以通过计算与第一个时间点差异来做到这一点，即连续时间点之间的变化幅度。如果Yt是时间t的度量值Y，则时间t的第一个差值ΔYt=Yt−Y(t-1)。该计算是以固定的间隔进行的，因此，对于时间t或t-1处缺失样本的受试者，不计算每个间隔的Δyt。这种转换是在`q2-longitudinal`的第一差分法中进行的。

```
# 20s
time qiime longitudinal first-differences \
  --m-metadata-file ecam-sample-metadata.tsv \
  --m-metadata-file shannon.qza \
  --p-state-column month \
  --p-metric shannon \
  --p-individual-id-column studyid \
  --p-replicate-handling random \
  --o-first-differences shannon-first-differences.qza
```

**输出对象：**

- `shannon-first-differences.qza`: 香浓指数第一距离。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fshannon-first-differences.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/shannon-first-differences.qza)

这将输出一个`SampleData[FirstDifferences]`对象，然后可以查看该对象，例如，使用波动率`volatility` 可视化工具或使用线性混合效果`linear-mixed-effects`或其他方法进行分析。

一个类似的方法是第一距离`first-distances`，它可以识别同一组连续样本之间的β-多样性距离。所有样本之间的成对距离已经可以通过`q2-diversity`beta多样性中核心度量`core-metrics`方法计算，因此该方法简单地识别从同一分组采集的连续样本之间的距离，并将这一系列值输出为其他方法可以使用的元数据。

```
# 25s
time qiime longitudinal first-distances \
  --i-distance-matrix unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-state-column month \
  --p-individual-id-column studyid \
  --p-replicate-handling random \
  --o-first-distances first-distances.qza
```

**输出结果：**

- `first-distances.qza`: 末加权unifrace距离转换的第一距离。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Ffirst-distances.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/first-distances.qza)


此输出可以与第一个差异的输出相同的方式使用。但是，第一距离的输出特别有说服力，因为它允许我们使用不能直接作用于距离矩阵的动作（如线性混合效应`linear-mixed-effects`）来分析β多样性的纵向变化。

```
# 47s
time qiime longitudinal linear-mixed-effects \
  --m-metadata-file first-distances.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-metric Distance \
  --p-state-column month \
  --p-individual-id-column studyid \
  --p-group-columns delivery,diet \
  --o-visualization first-distances-LME.qzv
```

**输出可视化：**

- `first-distances-LME.qzv`: 末加权unifrace距离转换的第一距离的混线分析。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Ffirst-distances-LME.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/first-distances-LME.qzv)


![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.04.jpg)

回归散点图中：按实验设计的分组方式下，距离与时间拟合存在规律的结果较好；残基与预测的距离间无拟合相关性的结果较好。

## 与从静态时间点比较跟踪变化率

**Tracking rate of change from static timepoints**

第一差异法`first-differences`和第一距离法`first-distances`都有一个可选的“基线”参数来代替计算与静态点的差异（例如，基线或给药时的时间点：ΔYt=Yt−Y0）。**计算基线差异有助于区分纵向数据噪声，揭示个体类别的潜在趋势，或突出与多样性变化或其他因变量相关的重要实验因素**。

```
time qiime longitudinal first-distances \
  --i-distance-matrix unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-state-column month \
  --p-individual-id-column studyid \
  --p-replicate-handling random \
  --p-baseline 0 \
  --o-first-distances first-distances-baseline-0.qza
```

**输出结果：**

- `first-distances-baseline-0.qza`: 0作为基线的距离。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Ffirst-distances-baseline-0.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/first-distances-baseline-0.qza)

> 注：我们发现一个有趣的事实！我们还可以使用第一距离法来跟踪个体样本之间共享特征比例的纵向变化。这可以通过计算每对样本之间的**成对Jaccard距离**（不考虑特征的丰度，非权重的方法）并将其用作第一距离的输入来计算。这对于与基线参数配对特别有用，例如，**确定在实验过程中如何丢失/获得独特的特性**。

## 非参数微生物相关性试验（NMIT）

**Non-parametric microbial interdependence test (NMIT)**

在微生物群落中，微生物种群不是孤立存在的，而是形成复杂的生态交互网络。这些相互依赖网络在同一组受试者中是否表现出相同的时间特征，可能表明不同的时间轨迹。NMIT评估一个群落内特征（如微生物类群、序列变异或OTU）之间的相互依赖性，以及如何随样本组的时间而变化。NMIT执行非参数微生物相关性测试，以确定纵向样本相似性作为微生物成分的时间函数。对于每个分组，NMIT计算每对特征之间的成对相关性。然后，根据每个受试者微生物相互依赖关系矩阵之间的距离范数计算受试者之间的距离。[更多详情和引文，请参见Zhang等人2017年的文章。](https://doi.org/10.1002/gepi.22065)

> 注释：与大多数纵向方法一样，NMIT在很大程度上取决于输入数据的质量。**这种方法只适用于纵向数据（即同一受试者随时间重复取样）**。为了使该方法更可靠，我们建议**每个受试者至少5-6个样本（时间点），但越多越好**。NMIT不要求在相同的时间点采集样本（因此对于丢失的样本也可以接受），但如果包括严重不足的样本量，或者样本的采样时间不足以有有生物学意义的方式排布，这可能会影响数据质量。这需要用户来确保他们的数据是高质量的，并且这些方法是以生物相关的方式使用的。

> 注释：**在非常大的功能表上运行NMIT可能需要很长时间。删除低丰度特征和合并分类上的特征表（例如，到属级）将缩短运行时间**。
首先，让我们下载一个要测试的特性表。在这里我们将测试属级分类群，要求在**超过15%的总样本中相对丰度大于0.1%**。

```
wget \
  -O "ecam-table-taxa.qza" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/ecam_table_taxa.qza"
```

现在我们准备好了运行NMIT。这个命令的输出是一个距离矩阵，我们可以将它传递给其他的qiime2命令，用于检验是否有意义和可视化。

```
# 21s
time qiime longitudinal nmit \
  --i-table ecam-table-taxa.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-individual-id-column studyid \
  --p-corr-method pearson \
  --o-distance-matrix nmit-dm.qza
```

**输出结果：**

- `nmit-dm.qza`: 非参相关检验。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fnmit-dm.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/nmit-dm.qza)
- `ecam-table-taxa.qza`: 时间序列属水平特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-table-taxa.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-table-taxa.qza)

现在让我们用距离矩阵来计算。首先，我们将进行Permanova检验来评估组间距离是否大于组内距离。

> 笔记：NMIT计算所有时间点上的受试者(样本/个体)之间的距离，因此每个受试者（如上文所用的`--p-individual-id-column`参数所定义）被压缩成一个单独的“样本”，表示受试者的纵向微生物相互依赖性。这个新的“样本”将用一个匹配的个体ID标记其中一个受试者的样本ID；这样做是为了方便将这个距离矩阵传递到下游步骤，而不需要生成一个新的样本元数据文件，但这意味着您必须注意。对于重要性测试和可视化，只使用跨每个单独ID统一的组列。**不要尝试使用随时间变化的元数据列，否则会发生错误结果**。例如，在教程元数据中，只有在使用抗生素之后，才会将患者标记为`AntiExposedall==Y`；这是一个不应该使用的列，因为它随时间而变化。现在享受分析数据的乐趣，并担负起科学客观严谨的责任。

```
# 13s
time qiime diversity beta-group-significance \
  --i-distance-matrix nmit-dm.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --m-metadata-column delivery \
  --o-visualization nmit.qzv
```

**输出可视化：**

- `nmit.qzv`: 末加权unifrace距离转换的第一距离的混线分析。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fnmit.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/nmit.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.05.jpg)

最后，我们可以计算主坐标，并使用Emperor来可视化对象`subjects` 之间的相似性（而不是单个样本；请参见上面的注释）。

```
time qiime diversity pcoa \
  --i-distance-matrix nmit-dm.qza \
  --o-pcoa nmit-pc.qza
```

**输出结果：**

- `nmit-pc.qza`: 主坐标分析。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fnmit-pc.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/nmit-pc.qza)

```
time qiime emperor plot \
  --i-pcoa nmit-pc.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --o-visualization nmit-emperor.qzv
```

**输出可视化：**

- `nmit-emperor.qzv`: 3D可视化结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fnmit-emperor.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/nmit-emperor.qzv)

就是这样。我们可以使用Permanova检验或其他基于距离的统计检验来确定各组是否表现出显著不同的纵向微生物相互依赖关系，以及PCoA/emperor来可视化各组受试者之间的关系。不要忘记上述关于使用和解释NMIT的注意事项。现在已经很安全了，可以轻松、开心的分析数据啦！

## 特征波动性分析

**Feature volatility analysis**

> 注: 此流程是一种有监督的回归方法。阅读[示例分类器教程](https://docs.qiime2.org/2020.2/tutorials/sample-classifier/)，了解有关一般过程、输出（例如，特征重要性分数）和受监督回归模型解释的更多详细信息。

此流程标识可预测数字元数据列“状态列`state_column`”（例如：时间）的功能，并使用交互式功能波动性图（仅绘制重要功能）绘制其跨状态的相对频率。监督学习回归器用于识别重要特征并评估其预测样本状态的能力。`State_column`通常是时间的度量，但是可以使用任何数字元数据列，而且这不是严格的纵向方法，除非使用`individual_id_column`参数（在这种情况下，特征波动率图将包含每个单独的意大利面线，如上所述）。 🍝

让我们在ecam数据集中测试一下。首先下载要使用的表：

```
wget -c \
  -O "ecam-table.qza" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/ecam_table_maturity.qza"

# 2m30s
time qiime longitudinal feature-volatility \
  --i-table ecam-table.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-state-column month \
  --p-individual-id-column studyid \
  --p-n-estimators 10 \
  --p-random-state 17 \
  --output-dir ecam-feat-volatility
```

**输出结果:**

- `ecam-table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-table.qza)
- `ecam-feat-volatility/filtered_table.qza`: 过滤的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-feat-volatility%2Ffiltered_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-feat-volatility/filtered_table.qza)
- `ecam-feat-volatility/sample_estimator.qza`: 样本估计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-feat-volatility%2Fsample_estimator.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-feat-volatility/sample_estimator.qza)
- `ecam-feat-volatility/feature_importance.qza`: 贡献度/重要性。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-feat-volatility%2Ffeature_importance.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-feat-volatility/feature_importance.qza)

**输出可视化结果:**

- `ecam-feat-volatility/accuracy_results.qzv`: 准确率评估，与机器学习回归类似。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-feat-volatility%2Faccuracy_results.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-feat-volatility/accuracy_results.qzv)
- `ecam-feat-volatility/volatility_plot.qzv:` 波动图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fecam-feat-volatility%2Fvolatility_plot.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/ecam-feat-volatility/volatility_plot.qzv)

此流程中使用的所有参数都是针对其他`q2-longitudinal`功能或[示例分类器教程中所描述的](https://mp.weixin.qq.com/s/ugs4X89SK28hF5dSWbqZbA)，因此，在此处不做讨论。此流程生成多个输出：

1. 波动图`volatility-plot`：包含一个交互式特征波动图。这与上面描述的波动可视化工具生成的图非常相似，有几个关键的区别。首先，只有特征可以作为“度量”查看（绘制在Y轴上）。第二，特征元数据（特征导入和描述性统计）在波动率图下方绘制为条形图。通过“度量”选择工具或单击条形图中的一个条形图，可以在波动图中绘制不同特征的相对频率。这使得根据重要性或其他功能元数据选择要查看的功能更加方便。默认情况下，当查看可视化时，最重要的特性将绘制在波动图中。可以使用条形图右侧的控制面板选择和排序不同的功能元数据。除了“累积平均变化”（每个状态下的累积变化量，包括正变化量和负变化量、跨状态变化量和跨样本平均变化量）和“净平均变化net average change”（正变化量和负变化量的总和）外，大多数变化都应该是不言而喻的，以确定特征是增加还是减少。基线和研究结束之间的丰度增加。
2. 结果精度`accuracy-results`：显示回归模型的预测精度。这一点很重要，因为如果模型不准确，重要特性就毫无意义。[有关回归器精度结果的更多描述，请参阅示例分类器教程。](https://mp.weixin.qq.com/s/ugs4X89SK28hF5dSWbqZbA)
3. 特征重要性`feature-importance`：包含所有特征的重要性得分。这可以在特征波动性图中看到，但是为了方便起见，这个对象仍然是输出的。[有关特性重要性分数的更多描述，请参阅示例分类器教程。](https://mp.weixin.qq.com/s/ugs4X89SK28hF5dSWbqZbA)
4. 过滤的特征表`filtered-table`：是一个只包含重要特征的`FeatureTable[RelativeFrequency]`对象。这是为了方便输出。
5. 样本估计量`sample-estimator`：包含训练样本回归器的样品。这是为了方便您计划对其他样本进行回归。有关`sampleEstimator`类型的更多描述，[请参阅示例分类器教程。](https://mp.weixin.qq.com/s/ugs4X89SK28hF5dSWbqZbA)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.06.jpg)

现在我们将介绍这些数据的基本解释。通过观察accuracy-results，我们发现回归器模型实际上非常精确，即使只使用了10个估计量来训练回归器（在实践中，应该使用更多的估计量，并且`--p-n-estimators`参数的默认值是100个估计量；有关更多描述，请参阅样本分类器教程这个参数）。结果很棒！特征的重要性是有意义的。根据这些样本的ASV组成，可以准确预测出生月份，这表明在这个儿童队列中，ASV的连续程序性发生在早期。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.07.jpg)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.08.jpg)

接下来我们将查看特征波动性图。我们看到，最重要的特征比第二重要的特征重要两倍多，所以这一特征真的可以预测一个对象的年龄！可以肯定的是，从波动率来看，我们发现在大多数受试者出生时，这一特征几乎完全不存在，但从大约出生8个月时开始逐渐增加。阴道分娩受试者的平均频率比剖宫产受试者高，因此可能是一个有趣的统计检验候选目标，例如线性混合效应模型。我们还可以使用元数据表将特征重要性数据与物种注释合并，以确定此ASV（以及其他重要特征）的分类信息。

## “成熟指数”预测

**“Maturity Index” prediction**

> 注意：目前，这种分析最适合于比较一段时间内采样相当均匀的组（用于回归的列）。不支持包含在不同时间零星采样组的数据集，用户在使用此可视化工具之前，应先筛选出这些样本或将其与其他组“分箱(bin)”在一起。

> 注意: 
这种分析只适用于样本量大的数据集，特别是在“对照”组，并且在每个时间点都有足够的生物学重复。

> 注意: 此流程是一种有监督的回归方法。阅读示例分类器教程，了解有关一般过程、输出（例如，特征重要性分数）和受监督回归模型解释的更多详细信息。

该方法根据特征数据训练的回归模型计算“微生物成熟度”指数，以预测给定的连续元数据列（“状态列state_column”），例如**预测受试者(个体/样本)的年龄作为微生物群组成的函数**。这种方法不同于标准监督回归，因为它量化了两个或更多组中随时间变化的相对速率。该模型在控制组样本的子集上进行训练，然后预测所有样本的列值。[如2014年Sathish等人发表的这种可视化计算成熟度指数z值（MAZ），以比较各组之间的相对“成熟度”](https://doi.org/10.1038/nature13421)。这种方法最初是用来预测不同年龄组肠道微生物群发育的差异，因此`state_column`通常是一个时间度量。其他类型的连续元数据梯度可能是可检验的，只要将两个或更多不同的“处理”组与“控制”组中的大量生物学重复进行比较，并且在相同的“状态”（梯度上的时间或位置）下对处理组进行采样以进行比较。但是，我们不必推荐或提供特殊方法的技术支持。

在这里，我们将在ECAM数据集中比较阴道分娩和剖宫产婴儿的微生物成熟度作为年龄的函数。

```
# 42s
 time qiime longitudinal maturity-index \
  --i-table ecam-table.qza \
  --m-metadata-file ecam-sample-metadata.tsv \
  --p-state-column month \
  --p-group-by delivery \
  --p-individual-id-column studyid \
  --p-control Vaginal \
  --p-test-size 0.4 \
  --p-stratify \
  --p-random-state 1010101 \
  --output-dir maturity
```

**输出结果:**

- `maturity/maz_scores.qza`: maz打分。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Fmaz_scores.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/maz_scores.qza)
- `maturity/sample_estimator.qza`: 样本估计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Fsample_estimator.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/sample_estimator.qza)
- `maturity/feature_importance.qza`: 贡献度/重要性。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Ffeature_importance.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/feature_importance.qza)
- `maturity/predictions.qza`: 预测值。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Fpredictions.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/predictions.qza)

**输出可视化结果:**

- `maturity/accuracy_results.qzv`: 结果准确性评估图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Faccuracy_results.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/accuracy_results.qzv)
- `maturity/volatility_plots.qzv`: 波动图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Fvolatility_plots.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/volatility_plots.qzv)
- `maturity/clustermap.qzv`: 聚类热图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Fclustermap.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/clustermap.qzv)
- `maturity/model_summary.qzv`: 模型统计基本信息。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Flongitudinal%2Fmaturity%2Fmodel_summary.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/longitudinal/maturity/model_summary.qzv)


本流程输出结果的解释如下：

1. `Accuracy_results.qzv`结果准确性评估：包含所有选择测试样本的预测值与预期值的线性回归图（[如样本分类器教程中所述](https://mp.weixin.qq.com/s/ugs4X89SK28hF5dSWbqZbA)）。这是“对照control”样本的一个子集，未用于模型训练（由测试集大小参数定义的分数）。
2. `volatibility-plots.qzv`波动图：包含一个交互式波动图。此可视化对于评估每个样本组中MAZ和其他度量值随时间的变化情况非常有用（默认情况下，使用“分组依据`group_by`”列，但可以为分组样本选择其他样本元数据）。此图表上显示的默认指标是所选状态列的MAZ分数。“预测”（预测的“状态栏`state_column`”值）和状态栏“成熟度”度量是由该插件计算的其他度量，值得研究。详见[2014年Sathish等人文中有关MAZ和成熟度指标的更多详细信息](https://doi.org/10.1038/nature13421)。
![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.09.jpg)
3. `clustermap.qzv`聚类热图：包含一个热图(heatmap)，显示每个组中每个重要特征在时间上的频率。此图有助于可视化每个组中重要特征的频率如何随时间变化，展示不同的特征丰度模式（例如，年龄或基于时间模型的发展轨迹）如何影响模型预测和MAZ评分。沿X轴显示的重要特征；按“分组依据`group_by`”和“状态依据`state_column`”列分组和排序的样本显示在Y轴上。请参见[heatmap，以获取有关特征如何沿X轴聚集的详细信息（使用默认参数）。](https://docs.qiime2.org/2020.2/plugins/available/feature-table/heatmap/)
4. `maz_scores.qza`MAZ得分：包含每个样本的MAZ分数（不包括训练样本）。这对于下游分析很有用，如下所述。
5. `predictions.qza`预测结果：包含每个样本（不包括训练样本）的“状态列state column”预测。这些预测用于计算MAZ评分，而子集（对照测试样本）用于评估模型的准确性。尽管如此，如果这些预测被证明是有用的…这些也可以在波动率图中查看。
6. `feature_importance.qza`特征重要性：包含最终回归模型中包含的所有功能的重要性分数。如果使用`optimize-feature-selection`参数，则只包含重要特征；否则，将为原始特征表中的所有特征分配重要性分数。
7. `sample_estimator.qza`样品估计器：包含经过训练的`SampleEstimator[Regressor]`。您可能不想在预测其他样本时重复使用这个估计量（因为它是在样本的一个子集上训练的），但是它是为好奇和无畏的人提供的。
![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.15.10.jpg)
8. `model_summary.qzv`包含监督学习估计器使用的模型参数的摘要，如[样本分类器教程中所述](https://mp.weixin.qq.com/s/ugs4X89SK28hF5dSWbqZbA)，该教程用于`classify-samples`流程中的等效命名输出。

那么这一切给我们呈现了什么呢？在我们在这里测试的ECAM数据集中，发现与阴道出生的受试者相比，第二年剖腹产受试者的MAZ评分受到抑制（见`volatibility plots.qzv`）。几个重要的ASV在这段时间内出现频率降低，表明参与了剖宫产的队列的延迟成熟（见`clustermap.qzv`）。（本教程示例没有固定随机状态集，因此每次运行结果可能略有不同）。

注意到目前为止，所有的研究结果都没有证实两组之间的统计差异。想把这个分析提升到下一个层次吗（用多元统计检验）？使用MAZ分数（或可能的预测）作为线性混合效应模型（如上所述）中的输入指标（因变量）。

## Reference

Antibiotics, birth mode, and diet shape microbiome maturation during early life
Nicholas A. Bokulich1, Jennifer Chung1, Thomas Battaglia1, Nora Henderson1, Melanie Jay1,2, Huilin Li3, Arnon D. Lieber1, Fen Wu1,2, Guillermo I. Perez-Perez1,4, Yu Chen1,2, William Schweizer5, Xuhui Zheng4, Monica Contreras1, Maria Gloria Dominguez-Bello1 and Martin J. Blaser^1,4,6,*^ **Science Translational Medicine**  15 Jun 2016:
Vol. 8, Issue 343, pp. 343ra82
https://doi.org/10.1126/scitranslmed.aad7121

https://docs.qiime2.org/2020.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为微生物组数据分析、分析方法开发与优化和科学传播，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1300万+。


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