[TOC]

# 前情提要

- [NBT：QIIME 2可重复、交互和扩展的微生物组数据分析平台](https://mp.weixin.qq.com/s/HCfXbJvu3KKS0wfw0NEzZw) 
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/xmfoA7MCSoRlnKJJgH823g)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/6j3EIeL1XHxBkrrY0pDNMQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/Njw2Uj66JViqigC3T6nGFw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/U-B5mIDJzOLpbm4DOfcqXA) 
- [Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DsqU8q5cb78P8tBKkFuC6w)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/TCZiqYOBdWdB1QlTnLHOjQ) 
- [Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/VXy9haFsnnMVlyXLULy52w)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/gB0Y8P0uzpIA1pml9nSf7g) 
- [mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/j86yqVOaZQYLKf2Ls-N6-w)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/Du9UUJ9prnpHXTwqmlIe0g)
- [Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/YO6f3vTOK-1W6f-AFAO97w)


# QIIME 2用户文档. 8差异丰度分析gneiss

**Differential abundance analysis with gneiss**

原文地址： https://docs.qiime2.org/2019.7/tutorials/gneiss/

**此实例需要一些基础知识，要求完成本系列文章前两篇内容：《[1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/xmfoA7MCSoRlnKJJgH823g)》和《[4人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/U-B5mIDJzOLpbm4DOfcqXA)》。**


在本教程中，您将学习如何使用`gneiss`中的`balances`来进行差异丰度分析。我们将关注的主要问题是如何以组成连贯的方式识别分类群的差异丰度。

> 详者注：`balances`在本文中指比值中的分子，对应中文的平衡、均衡、天平或余额都略有相似，但又不完全一致。目前没有标准翻译，文中还是使用原词 `balances`。

组成性指的是处理比例的问题。为了考虑测序深度的差异，微生物的丰度通常被标准化为比例（例如，相对丰度）。正因如此，准确地推断出哪些微生物正在发生变化就变得非常有挑战性——因为比例总和为1，单个微生物的变化也会改变其余微生物的比例。

考虑以下示例：

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.01.jpg)

**图1. 相对丰度变化示意图**

在左边，我们有十个物种的真实丰度，第一个物种在时间点1和时间点2之间加倍。当我们将这些按比例归一化时，似乎所有的物种在这两个时间点之间都发生了变化。单从比例上看，我们永远不会意识到这个问题，实际上我们不能仅仅根据比例精确地确定哪些物种正在发生变化。

虽然我们不能确切地解决鉴别不同物种的问题，但我们可以放宽这个问题，并询问微生物的哪些分区/部分(partitions)正在改变。在上面的例子中，如果我们计算第一种和第二种之间的比率，对于原始丰度和比例，这个比率在时间点1是1:1，在时间点2是2:1。这是`balances`试图解决的问题。我们可以把重点放在分类群（或分类组）之间的比率上，而不是放在单个分类群上，因为这些比率是由所观察物种的真实丰度和所观察的比例构成的。我们通常对这些比率进行对数转换，以优化可视化效果（“对数比”）。计算多个物种的`balances`（或ratios）的概念可以扩展到树，如下面的示例所示。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.02.jpg)

**图2. 树形图展示原始值、相对丰度、比例间的关系**

在左边，我们定义一棵树，其中每个树枝尖对应一个分类单元，下面是第一个样本中每个分类单元的比例。内部节点（即balances）定义了底下分类群之间的对数比率。右边是同一棵树，下面是不同样本中每个分类群的比例。只有一个分类群数量变化，正如我们之前所观察到的，所有分类群的比例都会改变，但是看看`balances`，只有包含紫色分类群的平衡才会改变。在这种情况下，`balances`不会改变，因为它只考虑红色与分类群之间的比率。通过观察`balances`而不是比例，我们可以通过限制观察只关注给定`balances`内的分类群来消除一些差异。

这里突出的问题是，我们如何构造`balances`树来控制这种变异，并识别出有趣的分类群差异丰富的分区？在gneiss中，这有三种主要的方法：

- 相关聚类(`Correlation clustering`)。如果我们没有关于如何将生物体聚集的相关先验信息，我们可以根据它们彼此共生的频率来将生物体分组在一起。这可以在`correlation-clustering`命令中获得，并为`ilr-hierarchical`创建树输入文件。
- 梯度聚类(`Gradient clustering`)。使用元数据类别对在相似样本类型中发现的分类群进行聚类。例如，如果我们要评估pH是否是驱动因子，我们可以根据观察到的分类群的pH进行聚类，并观察低pH生物与高pH生物的比例是否随着pH的变化而变化。这可以在`gradient-clustering`命令中获得，并为`ilr-hierarchical`创建树输入文件。
- 系统发育分析(`Phylogenetic analysis`)。也可以使用`gneiss`以外创建的系统发育树（例如，`rooted-tree.qza`）。在这种情况下，您可以使用您的系统发育树作为`ilr-phylogenetic`的输入。

一旦我们有了一棵树，我们就可以使用下面的等式来计算`balances`：

b_i = \sqrt{\frac{rs}{r+s}} \log \frac{g(x_r)}{g(x_s)}

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.03.jpg)

其中i表示树中的第i个内部节点，g(x)表示集合x内的几何平均值，x <sub>r</sub>表示`balances`分子中的分类群丰富度集合，x <sub>s</sub>表示`balances`分母中的分类群丰富度集合，r和s分别表示x<sub>r</sub>和x <sub>s</sub>内的分类群数量。

在计算出`balances`后，可以进行标准统计过程，如方差分析和线性回归。我们将使用`慢性疲劳综合症(Chronic Fatigue Syndrome )`数据集演示运行这些过程。

## 创建`balances`

**Creating balances**

在[Giloteaux等人(2016)发表的慢性疲劳综合征数据集中](https://microbiomejournal.biomedcentral.com/articles/10.1186/s40168-016-0171-4)，有87人，48名患者和39名健康对照组。本教程使用的数据是使用地球微生物组项目高变区4 (V4) 16S rRNA基因在Illumina MiSeq上测序产出的。

我们每次在分析数据前，需要打开工作环境，根据情况选择对应的打开方式。

**启动工作环境并创建工作目录**

```
# 定义工作目录变量，方便以后多次使用
wd=~/github/QIIME2ChineseManual/2019.7
mkdir -p $wd
# 进入工作目录，是不是很简介，这样无论你在什么位置就可以快速回到项目文件夹
cd $wd

# 方法1. 进入QIIME 2 conda工作环境
conda activate qiime2-2019.7
# 这时我们的命令行前面出现 (qiime2-2019.7) 表示成功进入工作环境

# 方法2. conda版本较老用户，使用source进入QIIME 2
source activate qiime2-2019.7

# 方法3. 如果是docker安装的请运行如下命令，默认加载当前目录至/data目录
docker run --rm -v $(pwd):/data --name=qiime -it  qiime2/core:2019.7

# 创建本节学习目录
mkdir qiime2-chronic-fatigue-syndrome-tutorial
cd qiime2-chronic-fatigue-syndrome-tutorial
```

**实验数据下载**

注意：**QIIME 2 官方测试数据部分保存在Google服务器上，国内下载比较困难**。可使用代理服务器(如蓝灯)下载  https://data.qiime2.org/2019.7/tutorials/gneiss/sample-metadata.tsv 保存为 sample-metadata.tsv 至此项分析的工作目录，或**公众号后台回复"qiime2"获取测试数据批量下载链接，你还可以跳过以后的wget步骤**。

**下载来源Google文档的实验设计**

```
wget \
  -O "sample-metadata.tsv" \
  "https://data.qiime2.org/2019.7/tutorials/gneiss/sample-metadata.tsv"
```

下载特征表和物种注释

```
wget -c \
  -O "table.qza" \
  "https://data.qiime2.org/2019.7/tutorials/gneiss/table.qza"
wget -c \
  -O "taxa.qza" \
  "https://data.qiime2.org/2019.7/tutorials/gneiss/taxa.qza"
```

首先，我们将定义我们想要构建`balances`的微生物的分区。同样，有多种可能的方法来构建一个树（即层级结构），它定义了我们要为其构建`balances`的微生物`balances`的分区。我们将在这个数据集中展示相关聚类( `correlation-clustering`)和梯度聚类(`gradient-clustering`)。

请注意，我们将运行的差异丰度技术将使用对数比转换(`log ratio transforms`)。由于不允许取零的对数，下面的两种聚类方法都包含一个默认的伪计数参数。这将用1替换表中的所有零，这样我们就可以在转换后的表上应用对数。
输入表是原始计数表（`FeatureTable[Frequency]`）。

## 方法1：相关性聚类

**Option 1: Correlation-clustering**

这个选项应该是您的默认选项。我们将通过Ward的分层聚类来采用无监督聚类，以获得`Principal Balances`。从本质上讲，这将使用Ward层次聚类来定义通常彼此共存的微生物的分区，这是由以下度量标准定义的。

`d(x,y) ＝ V[Ln(x/y)]`

其中x和y代表两种微生物在所有样品中的比例。如果两种微生物高度相关，那么这个数量将缩小到接近零。然后，Ward层次集群将使用这个距离度量来迭代地将相互关联的微生物群聚集在一起。最后，我们得到的树将突出显示高层极结构，并识别数据中的任何块。

```
time qiime gneiss correlation-clustering \
  --i-table table.qza \
  --o-clustering hierarchy.qza
```

输出对象:

- `table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Ftable.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/table.qza)
- `taxa.qza`: 物种注释。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Ftaxa.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/taxa.qza)
- `hierarchy.qza`: 层级结构。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Fhierarchy.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/hierarchy.qza)

## 选项2：梯度聚类

**Option 2: Gradient-clustering**

相关聚类(`correlation-clustering`)的另一种选择是基于数字元数据类别创建树。通过梯度聚类(`gradient-clustering`)，我们可以对出现在元数据类别类似范围内的分类群进行分组。在本例中，我们将使用元数据类别年龄创建树（层次结构）。请注意，元数据类别不能缺少变量，并且必须是数字。

```
# 6s
time qiime gneiss gradient-clustering \
  --i-table table.qza \
  --m-gradient-file sample-metadata.tsv \
  --m-gradient-column Age \
  --o-clustering gradient-hierarchy.qza
```

输出对象:

- `gradient-hierarchy.qza`: 梯度层级。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Fgradient-hierarchy.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/gradient-hierarchy.qza)

下游分析的一个重要考虑因素是过度拟合问题。当使用梯度聚类时，您正在创建一个树来最好地突出所选元数据类别中的成分差异，并且可能会得到假阳性结果。小心使用梯度聚类（`gradient-clustering`）。

## 用balances建立线性模型

**Building linear models using balances**

现在我们有了一个定义分区的树，我们可以执行等轴测对数比率（isometric log ratio，ILR）转换。ILR转换计算树中每个节点上组之间的对数比率。

```
# 5s
time qiime gneiss ilr-hierarchical \
  --i-table table.qza \
  --i-tree hierarchy.qza \
  --o-balances balances.qza
```

输出对象:

- `balances.qza`：对数比结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Fbalances.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/balances.qza)

既然我们有了树中每个节点的对数比率，我们就可以对`balances`进行线性回归。我们将要运行的线性回归称为多变量响应线性回归(multivariate response linear regression)，其归根结底是对每个`balances`分别执行线性回归。

我们可以用它来尝试将微生物丰度与环境变量联系起来。与标准单变量回归相比，运行此模型有多方面的优势，因为它可以避免与过度拟合相关的许多问题，并且可以让我们根据环境参数了解群落范围内的扰动。

由于微生物丰度可以直接映射到`balances`上，我们可以直接对`balances`进行多元回归。我们将要建立的模型表示如下

y→=β0→+βSubject→Xsubject→+βsex→Xsex→+βage→XAge→+βsCD14ugml→XsCD14ugml→+βLBPugml→XLBPugml→

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.04.jpg)


其中y是代表待预测的`balances`矩阵，βi→表示协变量i的系数向量，Xi→表示协变量i的测量。

记住，**方差分析(ANOVA)是线性回归的一种特殊情况——方差分析可以解决的每个问题都可以重新表述为线性回归**。详情请参阅本帖。所以我们仍然可以用这种方法回答同样的差异丰度问题，我们可以控制多个不同的潜在混淆变量和交互效应以获得更精确的答案。

为了更好的理解以下公式，我们先看一下实验设计的样式


```
less -S sample-metadata.tsv
```

```
#SampleID       Sample_Name_s   BarcodeSequence LinkerPrimerSequence    Subject Sex     Age     Pittsburgh      Bell    BMI     sCD14ugml       LBPugml LPSpgml IFABPpgml       Physical_functioning    Role_physical   Role_emotional  Energy_fatigue  Emotional_well_being    Social_functioning      Pain    General_health  Description
ERR1331797      LR17    AAGGGACAAGTG    TATGGTAATTGT    Patient Female  67      2       40.0    32.89   1.65    15.01   279.3   145.0   40.0    0.0     0.0     35.0    52.0    25.0    23.0    30.0    
ERR1331823      IC19    TCCACCCTCTAT    TATGGTAATTGT    Control Female  43                      26.15   1.36    18.76   100.54  184.1                                                                   
ERR1331841      LR49    CTGTAGCTTGGC    TATGGTAATTGT    Control Female  60                      30.89   1.23    12.43   97.36   234.4   
```

线性回归分析：

```
time qiime gneiss ols-regression \
  --p-formula "Subject+Sex+Age+BMI+sCD14ugml+LBPugml+LPSpgml" \
  --i-table balances.qza \
  --i-tree hierarchy.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization regression_summary.qzv
```

输出对象:

- regression_summary.qzv 回归摘要。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Fregression_summary.qzv) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/regression_summary.qzv)


![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.05.jpg)

**图5. 回归结果总结**。说明见下方段落。

现在我们总结了回归模型。具体来说，我们想看看哪些协变量(covariates)对模型影响最大，哪些`balances`有意义，以及有多少潜在的过度拟合正在发生。

在回归摘要中，有几点需要注意。摘要中有一个R<sup>2</sup>(Rsquared)，它给出了有关回归模型解释群落中有多少方差的信息。从我们看到的，**回归可以解释大约11%的群落结构变异**(Rsquared:	0.1108)。**这是典型的人类肠道微生物群，因为由于遗传、饮食、环境等因素，有非常高的混杂变异。**

**为了评价一个单一协变量的解释模型，采用了遗漏一个变量的方法（leave-one-variable-out approach，留一法（一种交叉验证方法））。留一法计算R<sup>2</sup>的变化(R<sup>2</sup>diff)。变化越大，协变量的作用越强。在这种情况下，实验对象(Subject)是最大的解释因素，解释了2.41%的变化。**

**为了确保我们不过度拟合，进行了10倍交叉验证。这将把数据分成10个分区，在其中9个分区上构建模型，并使用剩余的分区来度量预测的准确性**。此过程重复10次，每轮交叉验证一次。每轮交叉验证报告**模型内误差（within model error, mse）**、R<sup>2</sup>和预测精度（prediction accuracy, pred_mse）。在这里，**预测精度低于模型内误差，表明不会发生过拟合**。

接下来，我们采用热图可视化每个`balances`所有协变量的显著性水平(p值)。热图的列代表`balances`，热图的行代表协变量。**热图由p值的负对数着色，突出潜在的显著p值**。使用鼠标悬停功能可以获得特定的系数值及其对应的p值，并启用缩放可以探索感兴趣的协变量和`balances`。

接下来是预测(prediction)和残差(residual)图。这里，只绘制了前两个balances，模型中的预测残差被投影到这两个`balances`上。从这些图中我们可以看出，**预测点与原始群落位于同一区域内**。然而，我们可以看到，**残差与预测的方差大致相同**。这有点让人不安——但请注意，**我们只能解释10%的群落差异，所以这些计算很正常**。

可视化树中的分支长度也可以通过模型中可解释的平方和(sum of squares)进行标准化。最长的分支长度对应于最有用的`balances`。这可以让我们对模型中最重要的`balances`进行高层次的概述。从这个图和上面的热图中，我们可以看到`balances` y0很重要。这些`balances`不仅具有很小的p值（p<0.05），能用于区分受试者，而且它们在树形图中具有最大的分支长度。这表明微生物的这种划分可以区分CFS患者和对照组。

我们可以在一个热图上可视化这些`balances`，以了解它们代表的分类群。**默认情况下，特征表中的值是按对数标准化的，意味着样本值以零为中心**。

```
# 10s
time qiime gneiss dendrogram-heatmap \
  --i-table table.qza \
  --i-tree hierarchy.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column Subject \
  --p-color-map seismic \
  --o-visualization heatmap.qzv
```

输出可视化结果:

- `heatmap.qzv` :热图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Fheatmap.qzv) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/heatmap.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.06.jpg)

**图6. 层级聚类热图展示`balances`和实验分组间关系**。

如图例所示，每个`balances`的分子(numerators)以浅红色突出显示，而分母以深红色突出显示。从这里我们可以看到，y0的分母与y0的分子相比，几乎没有OTU。分母中的这些分类群可能重要，所以让我们研究一下用`balance_taxonomy`构成`balance`的分类。

具体来说，我们将绘制一个箱线图，并确定能够解释对照组和患者组之间差异的分类群。

```
# 16s
time qiime gneiss balance-taxonomy \
  --i-table table.qza \
  --i-tree hierarchy.qza \
  --i-taxonomy taxa.qza \
  --p-taxa-level 2 \
  --p-balance-name 'y0' \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column Subject \
  --o-visualization y0_taxa_summary.qzv
```

输出可视化结果:

- `y0_taxa_summary.qzv`：第一`balance`上的物种汇总。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fgneiss%2Fy0_taxa_summary.qzv) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/gneiss/y0_taxa_summary.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.07.jpg)

**图7. 展示组间差异的分类群**。

在这种特殊情况下，与对照组相比，患者组的对数比率更低。实质上，这意味着**与患者组相比，健康对照组y0分子中的分类群平均比y0分母中的分类群更丰富**。

记住，根据本教程开头给出的示例，不可能推断出给定样本中微生物的绝对变化。`Balances`将无法提供这类答案，但它可以限制可能出现情况的数量。具体来说，可能发生了以下五种情况之一。

1. 患者组与健康对照组y0分子的平均分类数增加。
2. 患者组与健康对照组间y0分母的分类平均下降；
3. 上述两种情况的结合；
4. y0分子和y0分母的类群丰度均增加，但y0分子的类群丰度比y0分子增加更多。
5. y0分子和y0分母的类群丰度均下降，而y0分子比y0分母的类群丰度相对增加较多。

为了进一步缩小这些假设，需要生物先验知识或实验验证。

## Reference

https://docs.qiime2.org/2019.7

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

Ludovic Giloteaux, Julia K. Goodrich, William A. Walters, Susan M. Levine, Ruth E. Ley & Maureen R. Hanson. Reduced diversity and altered composition of the gut microbiome in individuals with myalgic encephalomyelitis/chronic fatigue syndrome. Microbiome 4, 30, doi:10.1186/s40168-016-0171-4 (2016).

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为宏基因组数据分析和植物微生物组，QIIME 2项目参与人。目前在***Science、Nature Biotechnology***等杂志发表论文十余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章400余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(18篇)》](https://mp.weixin.qq.com/s/IZLjdkRq2-36DJ9X792_MA)等，关注人数6.5万+，累计阅读1000万+。

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