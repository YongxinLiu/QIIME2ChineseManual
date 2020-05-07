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

# 预测样本元数据`q2-sample-classifier`

**Predicting sample metadata values with q2-sample-classifier**

https://docs.qiime2.org/2020.2/tutorials/sample-classifier/

> 注：[`q2-sample-classifier`参考文档中提供了通过Python API和命令行界面使用所有插件操作的文档](https://docs.qiime2.org/2020.2/plugins/available/sample-classifier/)。最好按本教程顺序学习，想直接学习本章，至少完成本系列[《1简介和安装》](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)和[《4人体各部位微生物组分析Moving Pictures》](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)。

> 警告：与任何统计方法一样，**此插件中描述的操作需要足够的样本量才能获得有意义的结果。根据经验，[至少应提供50个样品(生物学重复而非技术重复)](http://scikit-learn.org/stable/tutorial/machine_learning_map/index.html)**。**用作分类器目标的分类元数据列的每个唯一值至少应具有10个样本，用作回归器目标的连续元数据列不应包含许多异常值或严重不均匀的分布**。较小的样本量将导致不准确的模型，并可能导致错误。

本教程将演示如何使用`q2-sample-classifier`预测样本元数据值。监督学习方法基于样本数据（如微生物群组成）可预测样本属性值（如元数据值）。预测目标可以是离散样本类（分类问题）或连续值（回归问题）。任何其他数据都可用作预测特征，但就`q2-sample-classifier`而言，这通常是微生物序列变异(ASV)、可操作分类单位（OTU）或分类组成数据。但是，功能表中包含的任何功能都可以使用——同样适用于非微生物数据，只需将[观测值/特征表转换为biom格式](http://biom-format.org/documentation/biom_conversion.html)，并将[特征表数据导入QIIME 2](https://docs.qiime2.org/2020.2/tutorials/importing/)。


**启动工作环境并创建工作目录**

```
# 定义工作目录变量，方便以后多次使用
wd=~/github/QIIME2ChineseManual/2020.2
mkdir -p $wd
# 进入工作目录，是不是很简介，这样无论你在什么位置就可以快速回到项目文件夹
cd $wd

# 方法1. 进入QIIME 2 conda工作环境
conda activate qiime2-2020.2
# 这时我们的命令行前面出现 (qiime2-2020.2) 表示成功进入工作环境

# 方法2. conda版本较老用户，使用source进入QIIME 2
source activate qiime2-2020.2

# 方法3. 如果是docker安装的请运行如下命令，默认加载当前目录至/data目录
docker run --rm -v $(pwd):/data --name=qiime -it  qiime2/core:2020.2

# 建立工作目录
mkdir -p sample-classifier-tutorial
cd sample-classifier-tutorial
```

## 预测样本分类

**Predicting categorical sample data**

监督学习分类器通过学习已知分类训练样本的组成，预测未知分类样本的分类元数据类别。例如，我们可以使用分类器根据粪便微生物组成诊断或预测疾病易感性，或者根据样本中检测到的序列变异、微生物类群或代谢物预测样本类型。在本教程中，我们将使用[《4人体各部位微生物组分析Moving Pictures》](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)的数据来训练一个分类器，该分类器预测收集样本的身体部位(Body Sites)。使用以下链接下载功能表和示例元数据：

```
wget \
  -O "moving-pictures-sample-metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/moving-pictures/sample_metadata.tsv"
# 下载不了从之前的文件夹中复制
cp ../qiime2-moving-pictures-tutorial/sample-metadata.tsv moving-pictures-sample-metadata.tsv

wget -c \
  -O "moving-pictures-table.qza" \
  "https://data.qiime2.org/2020.2/tutorials/sample-classifier/moving-pictures-table.qza"
```

接下来，我们将训练和测试一个分类器，它根据样本的微生物组成预测样本来源于哪个身体部位。我们将使用`classify-samples`流程来完成此操作，该流程中包括执行一系列步骤：

1. 输入样本随机分为训练集(`training set`)和测试集(`test set`)。测试集一直保留到分析流程结束，这样我们就可以在一组未用于模型训练的样本上测试准确性。使用`--p-test-size`参数调整要包含在测试集中的输入样本的分数。
2. 我们使用训练集样本训练学习模型。该模型被训练为根据与该样本关联的特征数据预测每个样本（包含在元数据列中）的特定目标值。可以使用`estimator`参数选择一系列不同的估计参数；有关单个估计参数的更多详细信息，请参阅[`scikit-learn`文档](http://scikit-learn.org/stable/supervised_learning.html)（不确定要选择哪个？参考[`estimator`估算器选择流程图](http://scikit-learn.org/stable/tutorial/machine_learning_map/index.html)）。
3. 在自动特征选择和参数优化步骤中执行`k-fold`[交叉验证](https://en.wikipedia.org/wiki/Cross-validation_(statistics))，以优化模型。默认情况下执行5次交叉验证，并且可以使用`--p-cv`参数调整该参数。
4. 训练完成的模型用于根据与该样品关联的特征数据预测每个测试样品的目标值，并预测每个样品的分类概率。 类别概率是样本属于每个类别的可能性（即具有相同目标值的样本组）。
5. 模型精度是通过将每个测试样本的预测值与该样本的真实值进行比较来确定的。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.01.png)

```
# 1m
time qiime sample-classifier classify-samples \
  --i-table moving-pictures-table.qza \
  --m-metadata-file moving-pictures-sample-metadata.tsv \
  --m-metadata-column body-site \
  --p-optimize-feature-selection \
  --p-parameter-tuning \
  --p-estimator RandomForestClassifier \
  --p-n-estimators 20 \
  --p-random-state 123 \
  --output-dir moving-pictures-classifier
```

**输出对象:**

- `moving-pictures-table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-table.qza)
- `moving-pictures-classifier/probabilities.qza`：概率。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fprobabilities.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/probabilities.qza)
- `moving-pictures-classifier/sample_estimator.qza`: 模型。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fsample_estimator.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/sample_estimator.qza)
- `moving-pictures-classifier/feature_importance.qza`: 重要性。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Ffeature_importance.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/feature_importance.qza)
- `moving-pictures-classifier/predictions.qza`: 预测结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fpredictions.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/predictions.qza)

**输出可视化:**

- `moving-pictures-classifier/accuracy_results.qzv`: 准确率评估。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Faccuracy_results.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/accuracy_results.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.02.jpg)

**图1.混淆矩阵(confusion matrix)** 热图显示分类结果，即各组预测的结果。可观察预测准确和错误的比例和类别。热图下面有对应数值的表。

- `moving-pictures-classifier/model_summary.qzv`: 模型摘要。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fmodel_summary.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/model_summary.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.03.jpg)

**图2. 不同特征数量与预测准确率的关系**

此流程生成多个输出。首先，让我们检查一下`accuracy_results.qzv`，它以混淆矩阵(confusion matrix)的形式显示分类精度结果，类似于[ROC曲线(Receiver Operating Characteristic curves)](https://en.wikipedia.org/wiki/Receiver_operating_characteristic)。这个矩阵表示样本被正确分类的频率和所有其他分类的频率。混淆矩阵以heatmap的形式显示在可视化的顶部，并在其下方显示为包含整体精度的表格（分配给测试样本的正确类别的比例分数）。ROC曲线是机器学习模型分类准确性的另一种图形表示。 ROC曲线绘制了各种阈值设置下的真实阳性率（y轴上的TPR, true positive rate）和错误阳性率（x轴上的FPR,false positive rate）之间的关系。 因此，曲线图的左上角代表“最佳”性能位置，表示FPR为零，TPR为1。 实际上，这种“最佳”情况不太可能发生，但是**曲线下面积（AUC）越大，表示性能越好**。

> 问题: 我们可以用分类样本`classify-samples`预测哪些其他元数据？查看示例元数据中的元数据列`sample-metadata`，并尝试其他一些分类列。不是所有的元数据都能被分类器轻易地学习！

此流程还输出了`predictions.qza`，其中包括每个测试样本的实际预测值。这是一个`SampleData[ClassifierPredictions]`对象，可以作为元数据查看。因此，我们可以使用`metadata tabulate`查看此元数据表：

```
qiime metadata tabulate \
  --m-input-file moving-pictures-classifier/predictions.qza \
  --o-visualization moving-pictures-classifier/predictions.qzv
```

输出对象:

- `moving-pictures-classifier/predictions.qzv`: 。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fpredictions.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/predictions.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.04.jpg)
**图3. 每个样品的预测结果**

除了预测的类别信息外，该模型还在`probability.qza`中报告各个类别的概率。 这是一个`SampleData [Probabilities]`对象，也可以作为元数据查看，因此让我们以元数据列表命令`metadata tabulate`查看：

```
qiime metadata tabulate \
  --m-input-file moving-pictures-classifier/probabilities.qza \
  --o-visualization moving-pictures-classifier/probabilities.qzv
```

输出对象:

- `moving-pictures-classifier/probabilities.qzv`:概率表 。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fprobabilities.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/probabilities.qzv)


监督学习方法的另一个真正有用的输出是选择的特征（feature selection），即它们报告哪些特征（如ASV或物种）最具预测性能。所有特征及其相对重要性（或特征权重或模型系数，取决于使用的学习模型）的列表将在`feature_importance.qza`中报告。具有更高重要性分数的特征对于区分类别更有用。特征重要性数值由使用的[`scikit-learn estimators`估计量直接分配；有关单个估计量及其重要性分数的更多详细信息，请参阅`scikit-learn`文档](http://scikit-learn.org/stable/supervised_learning.html)。请注意，一些估计量（尤其是`K-nearest neighbors models`）没有报告特征重要性得分，因此如果您使用这样的估计量，这个输出将毫无意义。功能导入属于语义类型`FeatureData[Importance]`，可以解释为（功能）元数据，因此我们可以使用`metadata tabulate`查看这些功能重要性（和/或[与其他功能元数据合并](https://docs.qiime2.org/2020.2/tutorials/metadata/#exploring-feature-metadata)）：


```
qiime metadata tabulate \
  --m-input-file moving-pictures-classifier/feature_importance.qza \
  --o-visualization moving-pictures-classifier/feature_importance.qzv
```

输出对象:

- `moving-pictures-classifier/feature_importance.qzv`: 重要性/贡献度 。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Ffeature_importance.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/feature_importance.qzv)


查看每个特征的`importance`

id | importance
---|---
02ef9a59d6da8b642271166d3ffd1b52|0.0
0305a4993ecf2d8ef4149fdfc7592603|0.02252683330522206

如果启用了`--p-optimize-feature-selection`，则此处只输出对象中所选的特征（即，最大化模型精度的最重要特征，如使用[递归特征消除](http://scikit-learn.org/stable/modules/feature_selection.html#recursive-feature-elimination)确定的特征），并且输出的所有其他结果（如模型精度和预测）都使用最终的优化模型，该模型使用精选的特征集。这不仅可以让我们看到哪些特性最重要（因此被模型使用），而且还可以使用这些信息从我们的特性表中过滤掉没有重要意义的特性，以便在`q2-sample-classifier`之外进行其他下游分析：

```
qiime feature-table filter-features \
  --i-table moving-pictures-table.qza \
  --m-metadata-file moving-pictures-classifier/feature_importance.qza \
  --o-filtered-table moving-pictures-classifier/important-feature-table.qza
```

输出对象:

- `moving-pictures-classifier/important-feature-table.qza`: 筛选重要特征对应的特征表 。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fimportant-feature-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/important-feature-table.qza)

我们还可以使用热图`heatmap`流程来生成每个样本或组中最重要特征的丰富热图。 让我们对每种样本类型中前30个最丰富的特征进行热图绘制：

```
time qiime sample-classifier heatmap \
  --i-table moving-pictures-table.qza \
  --i-importance moving-pictures-classifier/feature_importance.qza \
  --m-sample-metadata-file moving-pictures-sample-metadata.tsv \
  --m-sample-metadata-column body-site \
  --p-group-samples \
  --p-feature-count 30 \
  --o-filtered-table moving-pictures-classifier/important-feature-table-top-30.qza \
  --o-heatmap moving-pictures-classifier/important-feature-heatmap.qzv
```

输出对象:

- `moving-pictures-classifier/important-feature-table-top-30.qza`: 前30个重要特征。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fimportant-feature-table-top-30.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/important-feature-table-top-30.qza)

输出对象:

- `moving-pictures-classifier/important-feature-heatmap.qzv`: 特征热图。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fimportant-feature-heatmap.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/important-feature-heatmap.qzv)


此流程还生成一个可视化对象`model_summary.qzv`，中包含受监督的学习估计器所使用的模型参数摘要。如果启用了`--p-optimize-feature-selection`，可视化还将显示一个递归的特征移除图，该图说明了作为特征计数移除时对模型函数精度的影响如何变化。**最终模型自动选择最大精度的特征组合，用于其他输出中显示样本的预测结果**。

> 问题：当使用选项`--p-no-optimize-feature-selection`禁用功能优化时会发生什么？这对分类准确度有何影响？

最后，将训练的分类模型保存起来，以便在`sample_estimator.qza`对象中方便地重用！这允许我们预测其他示例的元数据值。例如，假设我们刚收到一批新样本，想要使用我们预先训练过的身体部位分类器来确定这些新样本是什么类型的样本。为了方便起见，在本例中，我们将假设我们有新的样本，并预测用于训练模型具有相同样本的值，但在实践中不可以这样做

警告：**在用于训练该模型的相同样本上测试监督学习模型将给出不切实际的性能评估**！ 🦄

### **基于模型来预测样品**

```
# 11s
time qiime sample-classifier predict-classification \
  --i-table moving-pictures-table.qza \
  --i-sample-estimator moving-pictures-classifier/sample_estimator.qza \
  --o-predictions moving-pictures-classifier/new_predictions.qza \
  --o-probabilities moving-pictures-classifier/new_probabilities.qza
```

**输出对象:**

- `moving-pictures-classifier/new_predictions.qza`：新预测结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fnew_predictions.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/new_predictions.qza)
- `moving-pictures-classifier/new_probabilities.qza`：新概率结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fnew_probabilities.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/new_probabilities.qza)

我们可以使用元数据表查看这些`new_predictions.qza`，方法如上所述。或者，如果这些样本不是“未知”样本，我们可以使用这批新样本重新测试模型精度：

```
qiime sample-classifier confusion-matrix \
  --i-predictions moving-pictures-classifier/new_predictions.qza \
  --i-probabilities moving-pictures-classifier/new_probabilities.qza \
  --m-truth-file moving-pictures-sample-metadata.tsv \
  --m-truth-column body-site \
  --o-visualization moving-pictures-classifier/new_confusion_matrix.qzv
```

**输出可视化:**

- `moving-pictures-classifier/new_confusion_matrix.qzv`：新混淆矩阵。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fmoving-pictures-classifier%2Fnew_confusion_matrix.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/moving-pictures-classifier/new_confusion_matrix.qzv)


![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.05.jpg)

**图4. 样本预测的混淆矩阵(confusion matrix)** 热图显示分类结果，即各组预测的结果。可观察预测准确和错误的比例和类别。热图下面有对应数值的表。


结果相当酷！这些结果的准确性应该非常高，因为我们忽略了上面关于不可以测试我们的训练数据的警告，这给了您一个很好的主意，为什么您应该遵循上面警告信息呢？😑

> 注: 我们在这里训练的模型是一个示例，包含了一项研究中非常少的样本，可能对预测其他未知样本没有帮助。但是，如果你有这些身体部位的样本，那么将它应用于你的数据可能是一个有趣的练习！

> 问题：试着找出`--p-parameter-tuning`参数的作用。当使用选项`--p-no-parameter-tuning`禁用它时会发生什么？这对分类准确度有何影响？

> 问题：在分类样本中，许多不同的分类器可以通过`--p-estimator`参数进行训练。试试其他分类器。这些方法如何比较？不只有随机森林一种方法可选！

> 问题：序列变体不是唯一可用于训练分类器或回归器的特征数据。分类组合是另一种特征类型，可以使用QIIME 2中提供的教程数据轻松创建。尝试弄清楚这是如何工作的（提示：您需要物种注释，如人体微生物组教程中所述，并按分类层级合并以创建新的特征表）。尝试使用折叠到不同分类级别的特征表。分类特异性（例如，比门级别更具体的物种级别）如何影响分类器性能？

**到底是ASV，还是门、纲、目、科、属种的分类结果更好，是尝试出来的，不是想或猜出来的，最好每个级别都做一次，找最优解方案。**

> 问题：`--p-n-estimators`参数调整了集合估计量（如随机森林分类器）构建决策树子集的数量（该参数对非集合方法没有影响），这将在一定程度上提高分类器的精度，但代价是增加了计算时间。使用上面相同的命令尝试使用不同数量的估计量，例如10、50、100、250和500个估计量。这将如何影响预测的总体准确性？花时间建更多的树有意义吗？


## 预测样本连续型元数据

**Predicting continuous (i.e., numerical) sample data**

监督(Supervised)学习回归器通过学习训练样本人为标签的组成，预测未标记样本的连续元数据值。例如，我们可以使用回归器来预测由微生物群落产生的代谢物的丰度，或样本的酸碱度、温度或海拔，作为序列变异、微生物分类群或样本中检测到的代谢物的属性。在本教程中，我们将使用[ECAM研究](https://doi.org/10.1126/scitranslmed.aad7121)，这是一项关于美国婴儿微生物组发育的纵向队列研究。使用以下链接下载特征表和示例元数据：

下载原数据和特征表

```
wget -c \
  -O "ecam-metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/sample_metadata.tsv"
wget -c \
  -O "ecam-table.qza" \
  "https://data.qiime2.org/2020.2/tutorials/longitudinal/ecam_table_maturity.qza"
```

接下来，我们将使用回归样本流程训练回归器，根据婴儿的微生物群组成预测婴儿的年龄。

```
# 44s
time qiime sample-classifier regress-samples \
  --i-table ecam-table.qza \
  --m-metadata-file ecam-metadata.tsv \
  --m-metadata-column month \
  --p-estimator RandomForestRegressor \
  --p-n-estimators 20 \
  --p-random-state 123 \
  --output-dir ecam-regressor
```

**输出对象:**

- `ecam-table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-table.qza)
- `ecam-regressor/sample_estimator.qza`: 模型。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-regressor%2Fsample_estimator.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-regressor/sample_estimator.qza)
- `ecam-regressor/feature_importance.qza`: 重要性。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-regressor%2Ffeature_importance.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-regressor/feature_importance.qza)
- `ecam-regressor/predictions.qza`: 预测结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-regressor%2Fpredictions.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-regressor/predictions.qza)

**输出可视化:**

- `ecam-regressor/accuracy_results.qzv`: 预测结果准确率评估。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-regressor%2Faccuracy_results.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-regressor/accuracy_results.qzv)
- `ecam-regressor/model_summary.qzv`: 回归模型总结可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-regressor%2Fmodel_summary.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-regressor/model_summary.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.06.jpg)

此命令生成的输出与分类样本生成的输出基本相同，但有一个主要的区别是准确度中的回归精度结果`qzv`以散点图的形式表示，该散点图显示了每个测试样本的预测值与真实值，并附有一条线性回归线，该线与95%置信区间（灰色阴影）的数据相匹配。预测值和真实值之间的真(true)1:1比率用虚线表示，以便进行比较。在此基础上，将模型精度量化为一个表，其中显示了均值、方差、误差和线性回归拟合的r值、p值、估计梯度的标准误差、斜率和截距。

- `ecam-regressor/model_summary.qzv`: 模型摘要。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-regressor%2Fmodel_summary.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-regressor/model_summary.qzv)


![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.07.jpg)

> 问题：我们可以用回归样本预测哪些其他元数据？查看示例元数据中的元数据列，并尝试其他一些值。并不是所有的元数据都能被回归器轻松学习！

> 问题：通过回归样本中的`--p-estimator`参数，可以训练出许多不同的回归量。试试其他的回归量。这些方法如何比较？

## 嵌套交叉验证为所有样本提供预测

**Nested cross-validation provides predictions for all samples**

在上面的示例中，我们将数据集拆分为用于模型训练和测试的训练集和测试集。**为了验证模型性能，我们必须保留一个模型从未见过的测试集**。但如果我们想预测数据集中每个样本的目标值呢？为此我们使用嵌套交叉验证（nested cross validation，NCV）。这在许多不同的情况下都是有用的，例如，对于预测标记错误的样本（在NCV期间分类错误的样本）或评估估计量方差（由于在NCV过程中对多个模型进行了训练 ，我们可以查看其精度的方差）。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.14.02.png)

在分析流程内部，**NCV的工作原理与K-Fold交叉验证非常类似**，用于分类样本和回归样本以进行模型优化，但是第二层交叉验证（一个“外循环”）被合并到训练和测试集K次中，这样每个样本都会在一个测试集中完成一次。在“外循环”的每次迭代中，训练集再次被拆分k次（在“内循环”中），以优化参数设置以估计Fold。最终结果：对K个不同的最终模型进行训练，每个样本得到一个预测值，并在每个迭代中平均特征重要性得分。总精度可以通过将这些预测值与真实值进行比较来计算，如下图所示，但对于那些对各倍数精度差异感兴趣的人，平均精度( mean accuracy)±SD将显示到标准输出。

在`q2-sample-classifier`中，对于分类和回归问题都有NCV方法。让我们给两个例子来全面了解一下，然后使用可视化工具来计算和查看聚合的模型精度结果。

### **分类的验证和可视化**

```
# NCV验证，35s
time qiime sample-classifier classify-samples-ncv \
  --i-table moving-pictures-table.qza \
  --m-metadata-file moving-pictures-sample-metadata.tsv \
  --m-metadata-column body-site \
  --p-estimator RandomForestClassifier \
  --p-n-estimators 20 \
  --p-random-state 123 \
  --o-predictions body-site-predictions-ncv.qza \
  --o-probabilities body-site-probabilities-ncv.qza \
  --o-feature-importance body-site-importance-ncv.qza
```

**输出对象:**

- `body-site-predictions-ncv.qza`: 特征表预测结果的NCV验证。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fbody-site-predictions-ncv.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/body-site-predictions-ncv.qza)
- `body-site-probabilities-ncv.qza`: 特征表预测概述的NCV验证。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fbody-site-probabilities-ncv.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/body-site-probabilities-ncv.qza)
- `body-site-importance-ncv.qza`: 特征重要性的NCV验证。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fbody-site-importance-ncv.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/body-site-importance-ncv.qza)

**NCV验证结果热图可视化**

```
# 19s
time qiime sample-classifier confusion-matrix \
  --i-predictions body-site-predictions-ncv.qza \
  --i-probabilities body-site-probabilities-ncv.qza \
  --m-truth-file moving-pictures-sample-metadata.tsv \
  --m-truth-column body-site \
  --o-visualization ncv_confusion_matrix.qzv
```

**输出可视化:**

- `ncv_confusion_matrix.qzv`: 预测结果准确率评估。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fncv_confusion_matrix.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ncv_confusion_matrix.qzv)

### **回归的验证和可视化**

NCV方法对回归模型进行交叉验证

```
# 26s
time qiime sample-classifier regress-samples-ncv \
  --i-table ecam-table.qza \
  --m-metadata-file ecam-metadata.tsv \
  --m-metadata-column month \
  --p-estimator RandomForestRegressor \
  --p-n-estimators 20 \
  --p-random-state 123 \
  --o-predictions ecam-predictions-ncv.qza \
  --o-feature-importance ecam-importance-ncv.qza
```

**输出对象:**

- `ecam-predictions-ncv.qza`: 预测结果的NCV验证。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-predictions-ncv.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-predictions-ncv.qza)
- `ecam-importance-ncv.qza`: 特征重要性的NCV验证。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-importance-ncv.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-importance-ncv.qza)


**结果可视化**

```
qiime sample-classifier scatterplot \
  --i-predictions ecam-predictions-ncv.qza \
  --m-truth-file ecam-metadata.tsv \
  --m-truth-column month \
  --o-visualization ecam-scatter.qzv
```

**输出可视化:**

- `ecam-scatter.qzv`: 预测结果的NCV验证。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fsample-classifier%2Fecam-scatter.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/sample-classifier/ecam-scatter.qzv)

> 注意: 我们使用混淆矩阵来呈现分类器的准确度，使用散点图来展示回归器的准确度👀


因此，**NCV方法输出的特征是重要性评分和样本预测**，而不是经过训练的估计量（如对上述样本进行分类`classify-samples`和回归样本`regress-samples`流程）。这是因为（1）k模型实际上用于预测，其中K等于外循环中使用的CV倍数的数量，返回和重新使用估计量会变得非常混乱；（2）对NCV感兴趣的用户很可能对重新使用模型来预测新样本并不感兴趣。

## 最佳实践：不应该使用`q2-sample-classifier`做的事情

**Best practices: things you should not do with q2-sample-classifier**

正如本教程所演示的，`q2-sample-classifier`对于特征选择和元数据预测非常强大。然而，正如电影蜘蛛侠中所説的：能力越大，责任也越大。毫无敬畏之心的用户有犯严重错误的风险，特别是由于过度拟合（Overfitting）和数据泄漏（data leakage）。下面列出了一个（不可避免的不完整）用户滥用该插件的方式列表，从而产生误导性的结果。不要做这些事。一般来说，为了避免数据泄漏和过度拟合，存在着更广泛的指南，所以这个列表关注的是这个插件和生物数据分析特有的错误实践。

1. 每当使用模型学习（通常是无意中）有关测试样本数据时，就会发生**数据泄漏(data leakage)**，从而导致过高的性能估计。
    1. **模型的准确性应始终根据学习模型从未见过的测试数据进行评估**。默认情况下，`q2-sample-classifier`中的流程和嵌套交叉验证方法（包括本教程中描述的方法）会执行此操作。但是，在独立使用`fit-*`和`predict-*`方法时必须小心。
    2. 在某些情况下**，技术重复可能存在问题**，并导致伪数据泄漏(pseudo-data leakage)，这取决于实验设计和技术精度。如果有疑问，请将**特性表分组为技术重复平均值**，或者在有监督的学习分析之前从数据中**过滤掉技术重复**。
2. 当一个学习模型被训练为对训练数据表现过优时，就会发生**过度拟合(Overfitting)**，但这样做不能很好地推广到其他数据集。这可能是有问题的，尤其是在小数据集上，并且每当输入数据被以不适当的方式扭曲时。
    1. 如果学习模型旨在根据批量产生的数据预测值（例如，对未来分析中生产的微生物组序列数据进行诊断），**考虑在训练数据中加入多个批次，以降低学习模型过度适应批量效应和类似噪音的可能性**。
    2. 同样，请注意，**批处理效果会强烈地影响性能，特别是当这些与您试图预测的目标值相关时**。例如，如果您希望对样本是否属于两个不同组中的一个进行分类，并且这些组是在单独的测序批次Run（对于微生物组扩增子序列数据）上进行测序的，那么针对这些数据对分类器进行训练可能会导致不准确的结果，而这些结果不能推广到其他数据集。
 
## Reference

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